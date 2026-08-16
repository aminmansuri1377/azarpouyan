import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// این middleware همون منطق getAdminSession شما رو روی هر درخواست چک می‌کنه
const enforceAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "برای انجام این عملیات باید وارد پنل مدیریت شوید",
    });
  }

  return next({ ctx });
});

// این procedure رو فقط جای create/update/delete های ادمین استفاده کن
export const adminProcedure = publicProcedure.use(enforceAdmin);
