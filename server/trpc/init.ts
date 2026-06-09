import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";

import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const adminMiddleware = t.middleware(async ({ ctx, next }) => {
  const token = ctx.cookieStore.get("admin-session");

  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  return next({
    ctx,
  });
});

export const protectedProcedure =
  publicProcedure.use(adminMiddleware);