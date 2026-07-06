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
  getAll: publicProcedure
    .input(
      z
        .object({
          categoryId: z.string().optional(),
          search: z.string().optional(),
          page: z.number().min(1).default(1),

          limit: z.number().min(1).max(100).default(10),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;

      const skip = (page - 1) * limit;

      const filters: any[] = [];

      if (input?.categoryId) {
        const categoryIds = await collectIdsInSubtree(
          ctx.prisma,
          input.categoryId,
        );

        filters.push({
          categoryId: {
            in: categoryIds,
          },
        });
      }

      if (input?.search?.trim()) {
        filters.push({
          translations: {
            some: {
              name: {
                contains: input.search.trim(),
                mode: "insensitive",
              },
            },
          },
        });
      }

      const where =
        filters.length > 0
          ? {
              AND: filters,
            }
          : {};

      const [items, total] = await Promise.all([
        ctx.prisma.product.findMany({
          where,

          skip,

          take: limit,

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
        }),

        ctx.prisma.product.count({
          where,
        }),
      ]);

      return {
        items,

        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      };
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
      try {
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
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error?.message ?? "خطا در ایجاد محصول",
        });
      }
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
      try {
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
              slug: translation.slug,
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
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error?.message ?? "خطا در بروزرسانی محصول",
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
        await ctx.prisma.product.delete({
          where: {
            id: input.id,
          },
        });

        return true;
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error?.message ?? "حذف محصول امکان‌پذیر نیست",
        });
      }
    }),
});
