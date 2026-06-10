import { z } from "zod";
import { router, publicProcedure } from "../init";

export const subCategoryRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.subCategory.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        category: {
          include: {
            translations: true,
          },
        },
        translations: {
          include: {
            language: true,
          },
        },
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
      return ctx.prisma.subCategory.findUnique({
        where: {
          id: input.id,
        },

        include: {
          translations: true,
          category: true,
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        categoryId: z.string(),

        slug: z.string(),

        imageUrl: z.string(),

        published: z.boolean(),

        translations: z.array(
          z.object({
            languageId: z.string(),

            name: z.string(),

            slug: z.string(),

            seoTitle: z.string().optional(),

            seoDescription: z.string().optional(),

            seoKeywords: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.subCategory.create({
        data: {
          categoryId: input.categoryId,

          slug: input.slug,

          imageUrl: input.imageUrl,

          published: input.published,

          translations: {
            create: input.translations,
          },
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),

        categoryId: z.string(),

        slug: z.string(),

        imageUrl: z.string(),

        published: z.boolean(),

        translations: z.array(
          z.object({
            languageId: z.string(),

            name: z.string(),

            slug: z.string(),

            seoTitle: z.string().optional(),

            seoDescription: z.string().optional(),

            seoKeywords: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, translations, ...subCategoryData } = input;

      await ctx.prisma.subCategory.update({
        where: {
          id,
        },

        data: subCategoryData,
      });

      for (const translation of translations) {
        await ctx.prisma.subCategoryTranslation.upsert({
          where: {
            subCategoryId_languageId: {
              subCategoryId: id,
              languageId: translation.languageId,
            },
          },

          update: {
            name: translation.name,
            slug: translation.slug,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            seoKeywords: translation.seoKeywords,
          },

          create: {
            subCategoryId: id,
            ...translation,
          },
        });
      }

      return true;
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.subCategory.delete({
        where: {
          id: input.id,
        },
      });

      return true;
    }),
});
