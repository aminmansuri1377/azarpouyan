import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { ContentType } from "@prisma/client";

const translationInput = z.object({
  languageId: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  body: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export const contentRouter = router({
  getAll: publicProcedure
    .input(z.object({ type: z.nativeEnum(ContentType) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.content.findMany({
        where: { type: input.type },
        orderBy: { createdAt: "desc" },
        include: {
          translations: {
            include: { language: true },
          },
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.content.findUnique({
        where: { id: input.id },
        include: {
          translations: {
            include: { language: true },
          },
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        type: z.nativeEnum(ContentType),
        coverImage: z.string(),
        published: z.boolean(),
        publishedAt: z.string().nullable().optional(),
        translations: z.array(translationInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { translations, publishedAt, ...rest } = input;
      return ctx.prisma.content.create({
        data: {
          ...rest,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
          translations: {
            create: translations,
          },
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        slug: z.string(),
        coverImage: z.string(),
        published: z.boolean(),
        publishedAt: z.string().nullable().optional(),
        translations: z.array(translationInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, translations, publishedAt, ...rest } = input;

      await ctx.prisma.content.update({
        where: { id },
        data: {
          ...rest,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });

      for (const translation of translations) {
        await ctx.prisma.contentTranslation.upsert({
          where: {
            contentId_languageId: {
              contentId: id,
              languageId: translation.languageId,
            },
          },
          update: {
            title: translation.title,
            slug: translation.slug,
            excerpt: translation.excerpt,
            body: translation.body,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            seoKeywords: translation.seoKeywords,
          },
          create: {
            contentId: id,
            ...translation,
          },
        });
      }

      return true;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.content.delete({ where: { id: input.id } });
      return true;
    }),
});
