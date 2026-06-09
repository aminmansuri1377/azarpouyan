"use client";

import { trpc } from "@/lib/trpc/client";

export default function News() {
  const { data } = trpc.health.useQuery();

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
      lllllllll
    </pre>
  );
}
