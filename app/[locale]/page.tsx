"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

export default function HomePage() {
  const params = useParams();

  const locale = params.locale as string;

  const { data: categories } = trpc.public.getCategories.useQuery({
    locale,
  });
  console.log("first", categories);
  return (
    <div style={{ padding: 30 }}>
      <h1>KGA Commerce</h1>

      <hr />

      {categories?.map((category) => {
        const t = category.translations[0];

        return (
          <div key={category.id}>
            <Link href={`/${locale}/category/${t?.slug}`}>{t?.name}</Link>
          </div>
        );
      })}
    </div>
  );
}
