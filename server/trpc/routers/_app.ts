import { router } from "../trpc";

import { healthRouter } from "./health";
import { languageRouter } from "./language";
import { adminAuthRouter } from "./admin-auth";
export const appRouter = router({
  health: healthRouter,
  adminAuth: adminAuthRouter,
  language: languageRouter,
});

export type AppRouter = typeof appRouter;
