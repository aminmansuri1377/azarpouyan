import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../init";

export const adminAuthRouter = router({
  login: publicProcedure
    .input(
      z.object({
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const correctPassword = process.env.ADMIN_PASSWORD;

        if (!correctPassword) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "تنظیمات ورود مدیر ناقص است",
          });
        }

        if (!input.password.trim()) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "رمز عبور را وارد کنید",
          });
        }

        if (input.password !== correctPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "رمز عبور وارد شده صحیح نیست",
          });
        }

        return {
          success: true,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("ADMIN_LOGIN_ERROR", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در ورود به پنل مدیریت",
        });
      }
    }),
});
