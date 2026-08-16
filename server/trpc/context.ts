import { prisma } from "@/server/prisma/client";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth/admin-session";

export async function createTRPCContext() {
  const cookieStore = await cookies();

  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = token ? verifyAdminToken(token) : false;

  return {
    prisma,
    cookieStore,
    isAdmin,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
