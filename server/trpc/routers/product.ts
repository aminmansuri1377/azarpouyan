import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { collectIdsInSubtree } from "@/lib/category-tree";

const translationInput = z.object({
  languageId: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  specifications: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export const productRouter = router({
  // لیست flat (برای select ها، breadcrumb و غیره)
  getAll: publicProcedure
    .input(
      z
        .object({
          categoryId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where = input?.categoryId
        ? {
            categoryId: {
              in: await collectIdsInSubtree(ctx.prisma, input.categoryId),
            },
          }
        : {};

      return ctx.prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          category: { include: { translations: true } },
          translations: { include: { language: true } },
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: { id: input.id },
        include: {
          category: { include: { translations: true } },
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
        published: z.boolean(),
        translations: z.array(translationInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.product.create({
        data: {
          slug: input.slug,
          imageUrl: input.imageUrl,
          images: input.images,
          categoryId: input.categoryId,
          published: input.published,
          translations: { create: input.translations },
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
        published: z.boolean(),
        translations: z.array(translationInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, translations, ...productData } = input;

      await ctx.prisma.product.update({
        where: { id },
        data: productData,
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
          create: { productId: id, ...translation },
        });
      }

      return true;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.product.delete({ where: { id: input.id } });
      return true;
    }),
});
