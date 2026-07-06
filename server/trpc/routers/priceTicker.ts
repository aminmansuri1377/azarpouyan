import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
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
      try {
        const { translations, ...rest } = input;

        return await ctx.prisma.priceTicker.create({
          data: {
            ...rest,
            translations: {
              create: translations,
            },
          },
        });
      } catch (error) {
        console.error("PRICE_TICKER_CREATE_ERROR", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در ایجاد قیمت لحظه‌ای",
        });
      }
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
      try {
        const { id, translations, ...rest } = input;

        const exists = await ctx.prisma.priceTicker.findUnique({
          where: { id },
          select: { id: true },
        });

        if (!exists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "آیتم مورد نظر پیدا نشد",
          });
        }

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
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("PRICE_TICKER_UPDATE_ERROR", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در بروزرسانی قیمت لحظه‌ای",
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
        const exists = await ctx.prisma.priceTicker.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
          },
        });

        if (!exists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "آیتم مورد نظر پیدا نشد",
          });
        }

        await ctx.prisma.priceTicker.delete({
          where: {
            id: input.id,
          },
        });

        return true;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("PRICE_TICKER_DELETE_ERROR", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در حذف قیمت لحظه‌ای",
        });
      }
    }),
});
