import { z } from "zod";

import { router, publicProcedure } from "../init";

export const adminAuthRouter = router({
  login: publicProcedure
    .input(
      z.object({
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const correctPassword = process.env.ADMIN_PASSWORD;

      if (input.password !== correctPassword) {
        throw new Error("Invalid password");
      }

      return {
        success: true,
      };
    }),
});
