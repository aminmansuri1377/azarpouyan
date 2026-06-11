import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const translationInput = z.object({
  languageId: z.string(),
  productName: z.string(),
  price: z.string(),
});

export const priceTickerRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.priceTicker.findMany({
      orderBy: { sortOrder: "asc" },
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
      return ctx.prisma.priceTicker.findUnique({
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
        active: z.boolean(),
        imageUrl: z.string().nullable().optional(),
        sortOrder: z.number().int(),
        translations: z.array(translationInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { translations, ...rest } = input;
      return ctx.prisma.priceTicker.create({
        data: {
          ...rest,
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
        active: z.boolean(),
        imageUrl: z.string().nullable().optional(),
        sortOrder: z.number().int(),
        translations: z.array(translationInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, translations, ...rest } = input;

      await ctx.prisma.priceTicker.update({
        where: { id },
        data: rest,
      });

      for (const translation of translations) {
        await ctx.prisma.priceTickerTranslation.upsert({
          where: {
            tickerId_languageId: {
              tickerId: id,
              languageId: translation.languageId,
            },
          },
          update: {
            productName: translation.productName,
            price: translation.price,
          },
          create: {
            tickerId: id,
            ...translation,
          },
        });
      }

      return true;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.priceTicker.delete({ where: { id: input.id } });
      return true;
    }),
});
