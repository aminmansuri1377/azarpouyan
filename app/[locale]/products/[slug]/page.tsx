"use client";

import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

export default function ProductPage() {
  const params = useParams();

  const locale = params.locale as string;

  const slug = params.slug as string;

  const { data } = trpc.public.getProductBySlug.useQuery({
    locale,
    slug,
  });

  if (!data) {
    return <div>Not Found</div>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>{data.name}</h1>

      <div>{data.description}</div>

      <hr />

      <div>{data.specifications}</div>
    </div>
  );
}
