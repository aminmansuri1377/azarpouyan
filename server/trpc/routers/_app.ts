import { router } from "../trpc";

import { healthRouter } from "./health";
import { languageRouter } from "./language";

export const appRouter = router({
  health: healthRouter,

  language: languageRouter,
});

export type AppRouter = typeof appRouter;
