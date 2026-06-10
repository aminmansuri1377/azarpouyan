import { router, publicProcedure } from "../init";

import {
  createLanguageSchema,
  updateLanguageSchema,
  deleteLanguageSchema,
} from "../schemas/language";

export const languageRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.language.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });
  }),

  create: publicProcedure
    .input(createLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.language.create({
        data: {
          code: input.code,
          name: input.name,
        },
      });
    }),

  update: publicProcedure
    .input(updateLanguageSchema)
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
    .input(deleteLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.language.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
