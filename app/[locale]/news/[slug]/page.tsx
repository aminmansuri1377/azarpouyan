"use client";

import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

export default function NewsSinglePage() {
  const params = useParams();

  const locale = params.locale as string;
  const slug = params.slug as string;

  const { data, isLoading } = trpc.public.getContentBySlug.useQuery({
    locale,
    slug,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>News not found</div>;
  }

  if (data.content.type !== "NEWS") {
    return <div>News not found</div>;
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 30,
      }}
    >
      <h1>{data.title}</h1>

      {data.excerpt && (
        <p>
          <i>{data.excerpt}</i>
        </p>
      )}

      <hr />

      <div>{data.body}</div>
    </div>
  );
}
