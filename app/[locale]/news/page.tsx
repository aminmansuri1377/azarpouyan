"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

export default function NewsPage() {
  const params = useParams();

  const locale = params.locale as string;

  const { data, isLoading } = trpc.public.getNews.useQuery({
    locale,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>News</h1>

      <hr />

      {data?.map((item) => {
        const t = item.translations[0];

        if (!t) return null;

        return (
          <div
            key={item.id}
            style={{
              marginBottom: 20,
            }}
          >
            <Link href={`/${locale}/news/${t.slug}`}>
              <h3>{t.title}</h3>
            </Link>

            {t.excerpt && <p>{t.excerpt}</p>}
          </div>
        );
      })}
    </div>
  );
}
