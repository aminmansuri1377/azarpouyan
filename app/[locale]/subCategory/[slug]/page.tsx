"use client";

import { useParams } from "next/navigation";

import Link from "next/link";

import { trpc } from "@/lib/trpc/client";

export default function SubCategoryPage() {
  const params = useParams();

  const locale = params.locale as string;

  const slug = params.slug as string;

  const { data } = trpc.public.getSubCategoryBySlug.useQuery({
    locale,
    slug,
  });

  if (!data) {
    return <div>Not Found</div>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>{data.name}</h1>

      {data.subCategory.products.map((product) => {
        const t = product.translations[0];

        return (
          <div key={product.id}>
            <Link href={`/${locale}/product/${t?.slug}`}>{t?.name}</Link>
          </div>
        );
      })}
    </div>
  );
}
