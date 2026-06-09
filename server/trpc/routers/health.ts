import { createTRPCRouter, publicProcedure } from "../init";

export const healthRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: Date.now(),
    };
  }),
});

export type HealthRouter = typeof healthRouter;
