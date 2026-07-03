"use client";

import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

import { PublicCategoryTree } from "@/components/PublicCategoryTree";

export default function HomePage() {
  const params = useParams();

  const locale = params.locale as string;

  const { data } = trpc.public.getCategoryTree.useQuery({
    locale,
  });

  return (
    <div style={{ padding: 30 }}>
      <h1>KGA Commerce</h1>

      <hr />

      {data && <PublicCategoryTree locale={locale} categories={data} />}
    </div>
  );
}
