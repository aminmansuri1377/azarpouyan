import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { sanitizeContentHtml } from "../../utils/sanitizeContent";

const translationInput = z.object({
  languageId: z.string(),
  name: z.string(),
  slug: z.string(),
  summary: z.string().optional(),
  specifications: z.string().optional(),
  description: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export const projectRouter = router({
  getAll: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
          publishedOnly: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const skip = (page - 1) * limit;

      const filters: Prisma.ProjectWhereInput[] = [];

      if (input?.publishedOnly) {
        filters.push({ published: true });
      }

      if (input?.search?.trim()) {
        const query = input.search.trim();
        filters.push({
          OR: [
            {
              slug: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              translations: {
                some: {
                  OR: [
                    {
                      name: {
                        contains: query,
                        mode: "insensitive",
                      },
                    },
                    {
                      slug: {
                        contains: query,
                        mode: "insensitive",
                      },
                    },
                    {
                      summary: {
                        contains: query,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              },
            },
          ],
        });
      }

      const where: Prisma.ProjectWhereInput =
        filters.length > 0 ? { AND: filters } : {};

      const [items, total] = await Promise.all([
        ctx.prisma.project.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            translations: {
              include: {
                language: true,
              },
            },
          },
        }),
        ctx.prisma.project.count({
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
      return ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: {
          translations: {
            include: {
              language: true,
            },
          },
        },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        slug: z.string(),
        imageUrl: z.string(),
        images: z.array(z.string()).default([]),
        published: z.boolean().default(true),
        translations: z.array(translationInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { translations, ...projectData } = input;

        return await ctx.prisma.project.create({
          data: {
            ...projectData,
            translations: {
              create: translations.map((t) => ({
                ...t,
                description: sanitizeContentHtml(t.description),
              })),
            },
          },
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "خطا در ایجاد پروژه";
        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        slug: z.string(),
        imageUrl: z.string(),
        images: z.array(z.string()).default([]),
        published: z.boolean(),
        translations: z.array(translationInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, translations, ...projectData } = input;

        await ctx.prisma.project.update({
          where: { id },
          data: projectData,
        });

        for (const translation of translations) {
          await ctx.prisma.projectTranslation.upsert({
            where: {
              projectId_languageId: {
                projectId: id,
                languageId: translation.languageId,
              },
            },
            update: {
              slug: translation.slug,
              name: translation.name,
              summary: translation.summary,
              specifications: translation.specifications,
              description: sanitizeContentHtml(translation.description),
              seoTitle: translation.seoTitle,
              seoDescription: translation.seoDescription,
              seoKeywords: translation.seoKeywords,
            },
            create: {
              projectId: id,
              languageId: translation.languageId,
              slug: translation.slug,
              name: translation.name,
              summary: translation.summary,
              specifications: translation.specifications,
              description: sanitizeContentHtml(translation.description),
              seoTitle: translation.seoTitle,
              seoDescription: translation.seoDescription,
              seoKeywords: translation.seoKeywords,
            },
          });
        }

        return true;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "خطا در بروزرسانی پروژه";
        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }
    }),

  delete: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.project.delete({
          where: { id: input.id },
        });
        return true;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "خطا در حذف پروژه";
        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }
    }),
});
