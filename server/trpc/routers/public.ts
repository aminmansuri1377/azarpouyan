import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const publicRouter = router({
  getLanguages: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.language.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });
  }),

  getCategories: publicProcedure
    .input(
      z.object({
        languageCode: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.category.findMany({
        where: {
          published: true,
        },

        include: {
          translations: {
            where: {
              language: {
                code: input.languageCode,
              },
            },
          },
        },
      });
    }),
});
