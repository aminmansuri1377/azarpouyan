import { createTRPCRouter, publicProcedure } from "../init";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: Date.now(),
    };
  }),
});

export type AppRouter = typeof appRouter;