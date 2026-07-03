"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

export default function CategoryPage() {
  const params = useParams();

  const locale = params.locale as string;

  const slug = params.slug as string;

  const { data, isLoading } = trpc.public.getCategoryPage.useQuery({
    locale,
    slug,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Not Found</div>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>{data.category.name}</h1>

      <hr />

      <h2>Sub Categories</h2>

      {data.children.length === 0 ? (
        <div>No Sub Categories</div>
      ) : (
        data.children.map((child) => {
          const t = child.translations[0];

          return (
            <div key={child.id}>
              <Link href={`/${locale}/category/${t.slug}`}>{t.name}</Link>
            </div>
          );
        })
      )}

      <hr />

      <h2>Products</h2>

      {data.products.length === 0 ? (
        <div>No Products</div>
      ) : (
        data.products.map((product) => {
          const t = product.translations[0];

          return (
            <div
              key={product.id}
              style={{
                marginBottom: 10,
              }}
            >
              <Link href={`/${locale}/products/${t.slug}`}>{t.name}</Link>
            </div>
          );
        })
      )}
    </div>
  );
}
