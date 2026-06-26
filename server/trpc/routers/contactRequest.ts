import { z } from "zod";

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
      return ctx.prisma.contactRequest.create({
        data: input,
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.contactRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.contactRequest.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  markAsRead: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contactRequest.update({
        where: {
          id: input.id,
        },

        data: {
          isRead: true,
        },
      });
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contactRequest.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
