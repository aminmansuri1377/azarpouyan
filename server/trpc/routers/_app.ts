import { router } from "../trpc";
import { categoryRouter } from "./category";

import { healthRouter } from "./health";
import { languageRouter } from "./language";
import { adminAuthRouter } from "./admin-auth";
import { subCategoryRouter } from "./subCategory";
export const appRouter = router({
  health: healthRouter,
  adminAuth: adminAuthRouter,
  language: languageRouter,
  category: categoryRouter,
  subCategory: subCategoryRouter,
});

export type AppRouter = typeof appRouter;
