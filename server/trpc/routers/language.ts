import { TRPCError } from "@trpc/server";
import { router, publicProcedure, adminProcedure } from "../init";

import {
  createLanguageSchema,
  updateLanguageSchema,
  deleteLanguageSchema,
} from "../schemas/language";

export const languageRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.language.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });
  }),

  create: adminProcedure
    .input(createLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const language = await ctx.prisma.language.create({
          data: {
            code: input.code,
            name: input.name,
          },
        });

        return {
          success: true,
          message: "Language created successfully",
          data: language,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }
    }),

  update: adminProcedure
    .input(updateLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const language = await ctx.prisma.language.update({
          where: {
            id: input.id,
          },
          data: {
            code: input.code,
            name: input.name,
            enabled: input.enabled,
            sortOrder: input.sortOrder,
          },
        });

        return {
          success: true,
          message: "Language updated successfully",
          data: language,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }
    }),

  delete: adminProcedure
    .input(deleteLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.language.delete({
          where: {
            id: input.id,
          },
        });

        return {
          success: true,
          message: "Language deleted successfully",
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }
    }),
});
