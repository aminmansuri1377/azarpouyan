"use client";

import { trpc } from "@/lib/trpc/client";

export default function TestPage() {
  const { data, isLoading } = trpc.language.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
