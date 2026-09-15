import { randomUUID } from "node:crypto";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, adminProcedure, publicProcedure } from "../trpc";
import {
  cleanupFiles,
  fileInput,
  journalStorageConfig,
  prepareDirectUpload,
  readReceipt,
  storageFailure,
  verifyUploadedFile,
} from "@/server/services/journal/storage";

import {
  normalizeGoogleDriveUrl,
  googleDriveDownloadUrl,
} from "@/lib/google-drive";

const id = z.string().min(1).max(100);
const token = z.string().min(1).max(3000);
const fields = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(20000),
  sortOrder: z.number().int().min(0).max(1000000),
  published: z.boolean(),
  pdfUrl: z
    .string()
    .trim()
    .min(1)
    .max(2048)
    .transform((value, ctx) => {
      try {
        return normalizeGoogleDriveUrl(value);
      } catch (error) {
        ctx.addIssue({
          code: "custom",
          message: error instanceof Error ? error.message : "لینک معتبر نیست",
        });
        return z.NEVER;
      }
    }),
});
const orderBy = [
  { sortOrder: "asc" },
  { createdAt: "asc" },
  { id: "asc" },
] as const;

export const journalRouter = router({
  getAll: adminProcedure.query(({ ctx }) =>
    ctx.prisma.journal.findMany({ orderBy: [...orderBy] }),
  ),
  getPublished: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.prisma.journal.findMany({
      where: { published: true, pdfUrl: { not: null } },
      orderBy: [...orderBy],
      select: { id: true, title: true, description: true, coverKey: true },
    });
    return rows.map(({ coverKey, ...row }) => ({
      ...row,
      image: `/api/image/${coverKey}`,
    }));
  }),
  prepareUpload: adminProcedure
    .input(
      z.object({
        id: id.optional(),
        version: z.date().optional(),
        cover: fileInput.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const target = input.id || randomUUID();
      let version: Date | undefined;
      if (input.id) {
        const old = await ctx.prisma.journal.findUnique({
          where: { id: input.id },
        });
        if (!old)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "گاهنامه یافت نشد.",
          });
        if (
          !input.version ||
          old.updatedAt.getTime() !== input.version.getTime()
        )
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "گاهنامه تغییر کرده است؛ فهرست را تازه و دوباره ویرایش کنید.",
          });
        version = old.updatedAt;
      } else if (!input.cover)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "تصویر جلد الزامی است.",
        });
      return {
        id: target,
        version,
        expiresAt: Date.now() + 55 * 60 * 1000,
        cover: input.cover
          ? await prepareDirectUpload(target, "cover", input.cover)
          : null,
      };
    }),
  create: adminProcedure
    .input(fields.extend({ id, coverToken: token }))
    .mutation(async ({ ctx, input }) => {
      const { id, coverToken, ...data } = input;
      const coverReceipt = readReceipt(coverToken, id, "cover");
      // A retry after a lost response reuses the same id and never creates a duplicate.
      const existing = await ctx.prisma.journal.findUnique({ where: { id } });
      if (existing) {
        if (
          existing.pdfUrl === data.pdfUrl &&
          existing.coverKey === coverReceipt.key
        )
          return existing;
        throw new TRPCError({
          code: "CONFLICT",
          message: "این شناسه قبلاً ثبت شده است.",
        });
      }
      const cover = await verifyUploadedFile(coverToken, id, "cover");
      // Do not delete staged objects on an ambiguous DB/network failure: the user can retry.
      return ctx.prisma.journal.create({
        data: {
          id,
          ...data,
          coverKey: cover.key,
        },
      });
    }),
  update: adminProcedure
    .input(
      fields.extend({
        id,
        version: z.date(),
        coverToken: token.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, version, coverToken, ...data } = input;
      const old = await ctx.prisma.journal.findUnique({ where: { id } });
      if (!old)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "گاهنامه یافت نشد.",
        });
      if (old.updatedAt.getTime() !== version.getTime())
        throw new TRPCError({
          code: "CONFLICT",
          message: "گاهنامه تغییر کرده است؛ فهرست را تازه کنید.",
        });
      const cover = coverToken
        ? await verifyUploadedFile(coverToken, id, "cover")
        : null;
      const result = await ctx.prisma.journal.updateMany({
        where: { id, updatedAt: version },
        data: {
          ...data,
          ...(cover ? { coverKey: cover.key } : {}),
        },
      });
      if (!result.count)
        throw new TRPCError({
          code: "CONFLICT",
          message: "گاهنامه هم‌زمان تغییر کرده است؛ فهرست را تازه کنید.",
        });
      await cleanupFiles([
        ...(cover && cover.key !== old.coverKey ? [old.coverKey] : []),
      ]);
      return { success: true };
    }),
  delete: adminProcedure
    .input(z.object({ id, version: z.date() }))
    .mutation(async ({ ctx, input }) => {
      const old = await ctx.prisma.journal.findUnique({
        where: { id: input.id },
      });
      if (!old)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "گاهنامه یافت نشد.",
        });
      const result = await ctx.prisma.journal.deleteMany({
        where: { id: input.id, updatedAt: input.version },
      });
      if (!result.count)
        throw new TRPCError({
          code: "CONFLICT",
          message: "گاهنامه تغییر کرده است؛ فهرست را تازه کنید.",
        });
      await cleanupFiles([old.coverKey]);
      return { success: true };
    }),
  getDownloadUrl: publicProcedure
    .input(z.object({ id }))
    .query(async ({ ctx, input }) => {
      const row = await ctx.prisma.journal.findUnique({
        where: { id: input.id },
      });
      if (!row || (!row.published && !ctx.isAdmin))
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "گاهنامه یافت نشد.",
        });
      if (!row.pdfUrl)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "لینک Google Drive این گاهنامه هنوز ثبت نشده است؛ آن را در پنل ویرایش کنید.",
        });
      return { url: googleDriveDownloadUrl(row.pdfUrl) };
    }),
  checkStorage: adminProcedure.query(async () => {
    const { endpoint } = journalStorageConfig();
    try {
      // Any HTTP response proves network/TLS reachability, not bucket permissions.
      const response = await fetch(endpoint, {
        method: "HEAD",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      return {
        message: `اتصال شبکه سرور به endpoint برقرار است (HTTP ${response.status}). این آزمون مجوز کلیدها و CORS مرورگر را بررسی نمی‌کند.`,
      };
    } catch (error) {
      throw storageFailure(error, "network-check");
    }
  }),
});
