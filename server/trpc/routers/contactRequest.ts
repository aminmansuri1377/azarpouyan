import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

export const contactRequestRouter = router({
  create: publicProcedure
    .input(
      z.object({
        fullName: z.string(),
        phone: z.string().optional(),
        companyName: z.string().optional(),
        email: z.string().optional(),
        subject: z.string().optional(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.contactRequest.create({
          data: input,
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در ثبت درخواست تماس",
        });
      }
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.contactRequest.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "خطا در دریافت لیست درخواست‌ها",
      });
    }
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.contactRequest.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "درخواست تماس پیدا نشد",
        });
      }

      return item;
    }),

  markAsRead: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.contactRequest.update({
          where: {
            id: input.id,
          },
          data: {
            isRead: true,
          },
        });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "درخواست تماس پیدا نشد",
        });
      }
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.contactRequest.delete({
          where: {
            id: input.id,
          },
        });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "درخواست تماس پیدا نشد",
        });
      }
    }),
});
