import { prisma } from "@/server/prisma/client";
import { cookies } from "next/headers";

export async function createTRPCContext() {
  const cookieStore = await cookies();

  return {
    prisma,
    cookieStore,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;