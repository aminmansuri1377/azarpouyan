"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

export default function HomePage() {
  const params = useParams();

  const locale = params.locale as string;

  const { data: languages } = trpc.public.getLanguages.useQuery();

  const { data: categories } = trpc.public.getCategories.useQuery({
    languageCode: locale,
  });

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <h1>KGA Commerce</h1>

      <hr />

      <h2>Languages</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 30,
        }}
      >
        {languages?.map((lang) => (
          <Link key={lang.id} href={`/${lang.code}`}>
            {lang.name}
          </Link>
        ))}
      </div>

      <hr />

      <h2>Categories</h2>

      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        {categories?.map((category) => {
          const translation = category.translations[0];

          return (
            <div
              key={category.id}
              style={{
                border: "1px solid #ddd",
                padding: 16,
              }}
            >
              <h3>{translation?.name}</h3>

              <p>slug: {translation?.slug}</p>

              <img src={category.imageUrl} alt="" width={150} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
