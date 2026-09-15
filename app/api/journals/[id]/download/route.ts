import { NextResponse } from "next/server";
import { TRPCError } from "@trpc/server";
import { appRouter } from "@/server/trpc/routers/_app";
import { createTRPCContext } from "@/server/trpc/context";
export const dynamic = "force-dynamic";
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const caller = appRouter.createCaller(await createTRPCContext());
    const { url } = await caller.journal.getDownloadUrl(await params);
    return new NextResponse(null, {
      status: 302,
      headers: { Location: url, "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "دریافت فایل انجام نشد" },
      {
        status:
          error instanceof TRPCError && error.code === "NOT_FOUND" ? 404 : 503,
      },
    );
  }
}
