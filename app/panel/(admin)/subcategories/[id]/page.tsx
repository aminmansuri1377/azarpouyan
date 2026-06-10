"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

export default function EditSubCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const utils = trpc.useUtils();

  const id = params.id as string;

  const { data: languages } = trpc.language.getAll.useQuery();

  const { data: categories } = trpc.category.getAll.useQuery();

  const { data, isLoading } = trpc.subCategory.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  const updateMutation = trpc.subCategory.update.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.subCategory.getAll.invalidate(),
        utils.subCategory.getById.invalidate(),
      ]);

      router.push("/panel/subcategories");
    },
  });

  const [categoryId, setCategoryId] = useState("");

  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [published, setPublished] = useState(true);

  const [translations, setTranslations] = useState<any[]>([]);

  useEffect(() => {
    if (!data) return;

    setCategoryId(data.categoryId);
    setSlug(data.slug);
    setImageUrl(data.imageUrl);
    setPublished(data.published);
    setTranslations(data.translations);
  }, [data]);

  const updateTranslation = (
    languageId: string,
    field: string,
    value: string,
  ) => {
    setTranslations((prev) =>
      prev.map((t) =>
        t.languageId === languageId
          ? {
              ...t,
              [field]: value,
            }
          : t,
      ),
    );
  };

  if (!id) return <div>Invalid ID</div>;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit SubCategory</h1>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.translations?.[0]?.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input value={slug} onChange={(e) => setSlug(e.target.value)} />

      <br />
      <br />

      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

      <br />
      <br />

      <label>
        Published
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
      </label>

      <hr />

      {languages?.map((lang) => {
        const t = translations.find((x) => x.languageId === lang.id);

        return (
          <div
            key={lang.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 20,
            }}
          >
            <h3>{lang.code}</h3>

            <input
              value={t?.name ?? ""}
              onChange={(e) =>
                updateTranslation(lang.id, "name", e.target.value)
              }
            />

            <br />

            <input
              value={t?.slug ?? ""}
              onChange={(e) =>
                updateTranslation(lang.id, "slug", e.target.value)
              }
            />

            <br />

            <input
              value={t?.seoTitle ?? ""}
              onChange={(e) =>
                updateTranslation(lang.id, "seoTitle", e.target.value)
              }
            />

            <br />

            <input
              value={t?.seoDescription ?? ""}
              onChange={(e) =>
                updateTranslation(lang.id, "seoDescription", e.target.value)
              }
            />

            <br />

            <input
              value={t?.seoKeywords ?? ""}
              onChange={(e) =>
                updateTranslation(lang.id, "seoKeywords", e.target.value)
              }
            />
          </div>
        );
      })}

      <button
        onClick={() =>
          updateMutation.mutate({
            id,
            categoryId,
            slug,
            imageUrl,
            published,
            translations,
          })
        }
      >
        Update
      </button>
    </div>
  );
}
