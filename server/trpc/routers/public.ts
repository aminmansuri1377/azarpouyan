import { z } from "zod";
import { router, publicProcedure } from "../trpc";

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
              subCategories: {
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

  getSubCategoryBySlug: publicProcedure
    .input(
      z.object({
        locale: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.subCategoryTranslation.findFirst({
        where: {
          slug: input.slug,

          language: {
            code: input.locale,
          },
        },

        include: {
          subCategory: {
            include: {
              products: {
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
    }),

  getProductBySlug: publicProcedure
    .input(
      z.object({
        locale: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.productTranslation.findFirst({
        where: {
          slug: input.slug,

          language: {
            code: input.locale,
          },
        },

        include: {
          product: true,
        },
      });
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
});
