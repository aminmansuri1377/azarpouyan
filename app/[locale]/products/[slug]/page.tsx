"use client";

import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

export default function ProductPage() {
  const params = useParams();

  const locale = params.locale as string;
  const slug = params.slug as string;

  console.log("locale", locale);
  console.log("slug", slug);

  const { data, isLoading, error } = trpc.public.getProductBySlug.useQuery({
    locale,
    slug,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error:
        {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        Product Not Found
        <br />
        slug: {slug}
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>{data.name}</h1>

      <hr />

      <p>
        <strong>Slug:</strong> {data.slug}
      </p>

      <p>
        <strong>Language:</strong> {data.language.code}
      </p>

      <hr />

      <div>{data.description}</div>

      <hr />

      <div>{data.specifications}</div>
    </div>
  );
}
