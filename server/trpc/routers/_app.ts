import { router } from "../trpc";
import { categoryRouter } from "./category";

import { healthRouter } from "./health";
import { languageRouter } from "./language";
import { adminAuthRouter } from "./admin-auth";
import { productRouter } from "./product";
import { publicRouter } from "./public";
import { contentRouter } from "./content";
import { priceTickerRouter } from "./priceTicker";
import { contactRequestRouter } from "./contactRequest";
import { projectRouter } from "./project";

import { journalRouter } from "./journal";

import { commentRouter } from "./comment";

export const appRouter = router({
  comment: commentRouter,
  journal: journalRouter,
  health: healthRouter,
  adminAuth: adminAuthRouter,
  language: languageRouter,
  category: categoryRouter,
  product: productRouter,
  project: projectRouter,
  public: publicRouter,
  content: contentRouter,
  priceTicker: priceTickerRouter,
  contactRequest: contactRequestRouter,
});

export type AppRouter = typeof appRouter;
