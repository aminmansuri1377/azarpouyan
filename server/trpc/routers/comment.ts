import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, adminProcedure, publicProcedure } from "../trpc";
import { commentInput } from "@/lib/comment-schema";

const orderBy = [
  { sortOrder: "asc" },
  { createdAt: "desc" },
  { id: "asc" },
] as const;
const identity = z.object({ id: z.string().min(1), version: z.date() });

export const commentRouter = router({
  getAll: adminProcedure.query(({ ctx }) =>
    ctx.prisma.comment.findMany({ orderBy: [...orderBy] }),
  ),
  getPublished: publicProcedure.query(({ ctx }) =>
    ctx.prisma.comment.findMany({
      where: { published: true },
      orderBy: [...orderBy],
      select: {
        id: true,
        fullName: true,
        companyName: true,
        text: true,
        imageUrl: true,
      },
    }),
  ),
  create: adminProcedure
    .input(commentInput)
    .mutation(({ ctx, input }) => ctx.prisma.comment.create({ data: input })),
  update: adminProcedure
    .input(commentInput.extend(identity.shape))
    .mutation(async ({ ctx, input }) => {
      const { id, version, ...data } = input;
      const result = await ctx.prisma.comment.updateMany({
        where: { id, updatedAt: version },
        data,
      });
      if (!result.count)
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "نظر تغییر کرده یا حذف شده است؛ فهرست را تازه و دوباره ویرایش کنید.",
        });
      return { success: true };
    }),
  delete: adminProcedure.input(identity).mutation(async ({ ctx, input }) => {
    const result = await ctx.prisma.comment.deleteMany({
      where: { id: input.id, updatedAt: input.version },
    });
    if (!result.count)
      throw new TRPCError({
        code: "CONFLICT",
        message: "نظر تغییر کرده یا حذف شده است؛ فهرست را تازه کنید.",
      });
    return { success: true };
  }),
});
