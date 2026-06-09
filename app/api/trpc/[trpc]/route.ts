import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/routers/_app";
import { createTRPCContext } from "@/server/trpc/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext(),
    onError({ error, path, type, req }) {
      console.error("tRPC error", {
        path,
        type,
        url: req.url,
        message: error.message,
        code: error.code,
        cause: error.cause,
      });
    },
  });

export { handler as GET, handler as POST };