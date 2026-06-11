"use client";

import { useParams } from "next/navigation";

import Link from "next/link";

import { trpc } from "@/lib/trpc/client";

export default function CategoryPage() {
  const params = useParams();

  const locale = params.locale as string;

  const slug = params.slug as string;

  const { data } = trpc.public.getCategoryBySlug.useQuery({
    locale,
    slug,
  });

  if (!data) {
    return <div>Not Found</div>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>{data.name}</h1>

      {data.category.subCategories.map((sub) => {
        const t = sub.translations[0];

        return (
          <div key={sub.id}>
            <Link href={`/${locale}/subCategory/${t?.slug}`}>{t?.name}</Link>
          </div>
        );
      })}
    </div>
  );
}
