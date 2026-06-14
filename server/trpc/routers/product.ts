import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const productRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        category: {
          include: {
            translations: true,
          },
        },

        subCategory: {
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
      return ctx.prisma.product.findUnique({
        where: {
          id: input.id,
        },

        include: {
          category: true,
          subCategory: true,

          translations: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        slug: z.string(),

        imageUrl: z.string(),
        images: z.array(z.string()).default([]),

        categoryId: z.string(),

        subCategoryId: z.string().nullable().optional(),

        published: z.boolean(),

        translations: z.array(
          z.object({
            languageId: z.string(),
            slug: z.string(),

            name: z.string(),

            description: z.string(),

            specifications: z.string(),

            seoTitle: z.string().optional(),

            seoDescription: z.string().optional(),

            seoKeywords: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.product.create({
        data: {
          slug: input.slug,

          imageUrl: input.imageUrl,
          images: input.images,

          categoryId: input.categoryId,

          subCategoryId: input.subCategoryId || null,

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

        slug: z.string(),

        imageUrl: z.string(),
        images: z.array(z.string()).default([]),

        categoryId: z.string(),

        subCategoryId: z.string().nullable().optional(),

        published: z.boolean(),

        translations: z.array(
          z.object({
            languageId: z.string(),
            slug: z.string(),

            name: z.string(),

            description: z.string(),

            specifications: z.string(),

            seoTitle: z.string().optional(),

            seoDescription: z.string().optional(),

            seoKeywords: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, translations, ...productData } = input;

      await ctx.prisma.product.update({
        where: {
          id,
        },

        data: {
          ...productData,

          subCategoryId: productData.subCategoryId || null,
        },
      });

      for (const translation of translations) {
        await ctx.prisma.productTranslation.upsert({
          where: {
            productId_languageId: {
              productId: id,
              languageId: translation.languageId,
            },
          },

          update: {
            name: translation.name,

            description: translation.description,

            specifications: translation.specifications,

            seoTitle: translation.seoTitle,

            seoDescription: translation.seoDescription,

            seoKeywords: translation.seoKeywords,
          },

          create: {
            productId: id,

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
      await ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      });

      return true;
    }),
});
