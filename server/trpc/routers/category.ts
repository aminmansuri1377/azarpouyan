import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const categoryRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        translations: true,
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: { id: input.id },
        include: {
          translations: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        imageUrl: z.string(),
        published: z.boolean().default(true),
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
      return ctx.prisma.category.create({
        data: {
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
        slug: z.string(),
        imageUrl: z.string(),
        published: z.boolean(),
        translations: z.array(
          z.object({
            id: z.string().optional(),
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
      return ctx.prisma.category.update({
        where: { id: input.id },
        data: {
          slug: input.slug,
          imageUrl: input.imageUrl,
          published: input.published,

          translations: {
            deleteMany: {},
            create: input.translations,
          },
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.delete({
        where: { id: input.id },
      });
    }),
});
