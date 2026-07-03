import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { collectIdsInSubtree } from "@/lib/category-tree";
import { collectIdsInSubtreeFront } from "@/lib/category-tree-front";
import { resolveLocalizedSlug } from "@/server/services/localization/resolveLocalizedPath";
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

        search: z.string().optional(),

        page: z.number().min(1).default(1),

        limit: z.number().min(1).max(100).default(12),
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

      const categoryIds = await collectIdsInSubtreeFront(
        ctx.prisma,
        translation.category.id,
      );

      const where = {
        published: true,

        categoryId: {
          in: categoryIds,
        },

        ...(input.search?.trim()
          ? {
              translations: {
                some: {
                  language: {
                    code: input.locale,
                  },

                  name: {
                    contains: input.search.trim(),
                    mode: "insensitive" as const,
                  },
                },
              },
            }
          : {}),
      };

      const total = await ctx.prisma.product.count({
        where,
      });

      const products = await ctx.prisma.product.findMany({
        where,

        include: {
          translations: {
            where: {
              language: {
                code: input.locale,
              },
            },
          },
        },

        skip: (input.page - 1) * input.limit,

        take: input.limit,

        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        category: translation,

        children: translation.category.children,

        products,

        total,

        page: input.page,

        totalPages: Math.ceil(total / input.limit),
      };
    }),
  searchProducts: publicProcedure
    .input(
      z.object({
        locale: z.string(),

        search: z.string(),

        page: z.number().default(1),

        limit: z.number().default(12),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        published: true,

        translations: {
          some: {
            language: {
              code: input.locale,
            },

            name: {
              contains: input.search,
              mode: "insensitive" as const,
            },
          },
        },
      };

      const total = await ctx.prisma.product.count({
        where,
      });

      const products = await ctx.prisma.product.findMany({
        where,

        include: {
          translations: {
            where: {
              language: {
                code: input.locale,
              },
            },
          },
        },

        skip: (input.page - 1) * input.limit,

        take: input.limit,

        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        items: products,

        total,

        totalPages: Math.ceil(total / input.limit),
      };
    }),
  getLocalizedPath: publicProcedure
    .input(
      z.object({
        currentLocale: z.string(),
        targetLocale: z.string(),
        pathname: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const parts = input.pathname.split("/").filter(Boolean);

      if (parts.length === 0) {
        return {
          path: `/${input.targetLocale}`,
        };
      }

      const pageType = parts[1];

      const slug = parts[2];

      //
      // HOME
      //
      if (parts.length === 1) {
        return {
          path: `/${input.targetLocale}`,
        };
      }

      //
      // STATIC PAGES
      //
      const staticPages = ["contact", "test"];

      if (staticPages.includes(pageType)) {
        return {
          path: input.pathname.replace(
            `/${input.currentLocale}`,
            `/${input.targetLocale}`,
          ),
        };
      }

      //
      // LIST PAGES
      //
      const listingPages = ["blog", "news", "articles", "price-ticker"];

      if (listingPages.includes(pageType) && !slug) {
        return {
          path: `/${input.targetLocale}/${pageType}`,
        };
      }

      //
      // CATEGORY
      //
      if (pageType === "category" && slug) {
        const translated = await resolveLocalizedSlug({
          prisma: ctx.prisma,

          translationModel: ctx.prisma.categoryTranslation,

          entityIdField: "categoryId",

          slug,

          currentLocale: input.currentLocale,

          targetLocale: input.targetLocale,
        });

        return {
          path: translated
            ? `/${input.targetLocale}/category/${translated.slug}`
            : `/${input.targetLocale}`,
        };
      }

      //
      // PRODUCT
      //
      if (pageType === "products" && slug) {
        const translated = await resolveLocalizedSlug({
          prisma: ctx.prisma,

          translationModel: ctx.prisma.productTranslation,

          entityIdField: "productId",

          slug,

          currentLocale: input.currentLocale,

          targetLocale: input.targetLocale,
        });

        return {
          path: translated
            ? `/${input.targetLocale}/products/${translated.slug}`
            : `/${input.targetLocale}`,
        };
      }

      //
      // BLOG
      //
      if (pageType === "blog" && slug) {
        const translated = await resolveLocalizedSlug({
          prisma: ctx.prisma,

          translationModel: ctx.prisma.contentTranslation,

          entityIdField: "contentId",

          slug,

          currentLocale: input.currentLocale,

          targetLocale: input.targetLocale,
        });

        return {
          path: translated
            ? `/${input.targetLocale}/blog/${translated.slug}`
            : `/${input.targetLocale}/blog`,
        };
      }

      //
      // NEWS
      //
      if (pageType === "news" && slug) {
        const translated = await resolveLocalizedSlug({
          prisma: ctx.prisma,

          translationModel: ctx.prisma.contentTranslation,

          entityIdField: "contentId",

          slug,

          currentLocale: input.currentLocale,

          targetLocale: input.targetLocale,
        });

        return {
          path: translated
            ? `/${input.targetLocale}/news/${translated.slug}`
            : `/${input.targetLocale}/news`,
        };
      }

      //
      // ARTICLE
      //
      if (pageType === "articles" && slug) {
        const translated = await resolveLocalizedSlug({
          prisma: ctx.prisma,

          translationModel: ctx.prisma.contentTranslation,

          entityIdField: "contentId",

          slug,

          currentLocale: input.currentLocale,

          targetLocale: input.targetLocale,
        });

        return {
          path: translated
            ? `/${input.targetLocale}/articles/${translated.slug}`
            : `/${input.targetLocale}/articles`,
        };
      }

      //
      // PRICE TICKER
      //
      if (pageType === "price-ticker" && slug) {
        const translated = await resolveLocalizedSlug({
          prisma: ctx.prisma,

          translationModel: ctx.prisma.priceTickerTranslation,

          entityIdField: "tickerId",

          slug,

          currentLocale: input.currentLocale,

          targetLocale: input.targetLocale,
        });

        return {
          path: translated
            ? `/${input.targetLocale}/price-ticker/${translated.slug}`
            : `/${input.targetLocale}/price-ticker`,
        };
      }

      //
      // FALLBACK
      //
      return {
        path: input.pathname.replace(
          `/${input.currentLocale}`,
          `/${input.targetLocale}`,
        ),
      };
    }),
});
