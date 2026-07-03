import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { collectIdsInSubtree } from "@/lib/category-tree";
import { collectIdsInSubtreeFront } from "@/lib/category-tree-front";

export const publicRouter = router({
  getLanguages: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.language.findMany({
      where: {
        enabled: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  }),

  getCategories: publicProcedure
    .input(
      z.object({
        locale: z.string(),
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
                code: input.locale,
              },
            },
          },
        },
      });
    }),

  getCategoryBySlug: publicProcedure
    .input(
      z.object({
        locale: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const translation = await ctx.prisma.categoryTranslation.findFirst({
        where: {
          slug: input.slug,

          language: {
            code: input.locale,
          },
        },

        include: {
          category: {
            include: {
              children: {
                where: {
                  published: true,
                },

                include: {
                  translations: {
                    where: {
                      language: {
                        code: input.locale,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return translation;
    }),

  getProductBySlug: publicProcedure
    .input(
      z.object({
        locale: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.productTranslation.findFirst({
        where: {
          slug: input.slug,

          language: {
            code: input.locale,
          },

          product: {
            published: true,
          },
        },

        include: {
          product: {
            include: {
              category: true,
            },
          },

          language: true,
        },
      });

      return product;
    }),

  getNews: publicProcedure
    .input(
      z.object({
        locale: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.content.findMany({
        where: {
          type: "NEWS",
          published: true,
        },

        include: {
          translations: {
            where: {
              language: {
                code: input.locale,
              },
            },
          },
        },

        orderBy: {
          publishedAt: "desc",
        },
      });
    }),

  getBlogs: publicProcedure
    .input(
      z.object({
        locale: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.content.findMany({
        where: {
          type: "BLOG",
          published: true,
        },

        include: {
          translations: {
            where: {
              language: {
                code: input.locale,
              },
            },
          },
        },

        orderBy: {
          publishedAt: "desc",
        },
      });
    }),
  getContentBySlug: publicProcedure
    .input(
      z.object({
        locale: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.contentTranslation.findFirst({
        where: {
          slug: input.slug,

          language: {
            code: input.locale,
          },

          content: {
            published: true,
          },
        },

        include: {
          content: true,
          language: true,
        },
      });
    }),
  getCategoryTree: publicProcedure
    .input(
      z.object({
        locale: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const language = await ctx.prisma.language.findUnique({
        where: {
          code: input.locale,
        },
      });

      if (!language) {
        return [];
      }

      const categories = await ctx.prisma.category.findMany({
        where: {
          published: true,
        },

        include: {
          translations: {
            where: {
              languageId: language.id,
            },
          },
        },

        orderBy: {
          sortOrder: "asc",
        },
      });

      function buildTree(parentId: string | null): any[] {
        return categories
          .filter((c) => c.parentId === parentId)
          .map((c) => ({
            ...c,
            children: buildTree(c.id),
          }));
      }

      return buildTree(null);
    }),
  getCategoryPage: publicProcedure
    .input(
      z.object({
        locale: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const translation = await ctx.prisma.categoryTranslation.findFirst({
        where: {
          slug: input.slug,

          language: {
            code: input.locale,
          },
        },

        include: {
          category: {
            include: {
              children: {
                include: {
                  translations: {
                    where: {
                      language: {
                        code: input.locale,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!translation) {
        return null;
      }

      const ids = await collectIdsInSubtreeFront(
        ctx.prisma,
        translation.category.id,
      );

      const products = await ctx.prisma.product.findMany({
        where: {
          published: true,

          categoryId: {
            in: ids,
          },
        },

        include: {
          translations: {
            where: {
              language: {
                code: input.locale,
              },
            },
          },
        },
      });

      return {
        category: translation,
        children: translation.category.children,
        products,
      };
    }),
});
