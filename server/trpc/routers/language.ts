import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const languageRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.language.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });
  }),

  getEnabled: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.language.findMany({
      where: {
        enabled: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        code: z.string().min(2).max(10).toLowerCase(),

        name: z.string().min(2).max(100),

        sortOrder: z.number().int().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.language.create({
        data: {
          code: input.code,
          name: input.name,
          sortOrder: input.sortOrder,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),

        code: z.string().min(2).max(10),

        name: z.string().min(2).max(100),

        enabled: z.boolean(),

        sortOrder: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.language.update({
        where: {
          id: input.id,
        },
        data: {
          code: input.code,
          name: input.name,
          enabled: input.enabled,
          sortOrder: input.sortOrder,
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
      return ctx.prisma.language.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
