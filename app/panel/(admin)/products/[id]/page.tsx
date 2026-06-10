"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { trpc } from "@/lib/trpc/client";

export default function EditProductPage() {
  const router = useRouter();

  const params = useParams();

  const id = params.id as string;

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.product.getById.useQuery(
    { id },
    {
      enabled: !!id,
    },
  );

  const { data: languages } = trpc.language.getAll.useQuery();

  const { data: categories } = trpc.category.getAll.useQuery();

  const { data: subCategories } = trpc.subCategory.getAll.useQuery();

  const updateMutation = trpc.product.update.useMutation({
    onSuccess: async () => {
      await utils.product.getAll.invalidate();

      await utils.product.getById.invalidate({
        id,
      });

      router.push("/panel/products");
    },
  });

  const [slug, setSlug] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [subCategoryId, setSubCategoryId] = useState("");

  const [published, setPublished] = useState(true);

  const [translations, setTranslations] = useState<any[]>([]);

  useEffect(() => {
    if (!data) return;

    setSlug(data.slug);

    setImageUrl(data.imageUrl);

    setCategoryId(data.categoryId);

    setSubCategoryId(data.subCategoryId ?? "");

    setPublished(data.published);

    setTranslations(data.translations);
  }, [data]);

  const updateTranslation = (
    languageId: string,
    field: string,
    value: string,
  ) => {
    setTranslations((prev) => {
      const existing = prev.find((t) => t.languageId === languageId);

      if (existing) {
        return prev.map((t) =>
          t.languageId === languageId
            ? {
                ...t,
                [field]: value,
              }
            : t,
        );
      }

      return [
        ...prev,
        {
          languageId,

          name: "",

          slug: "",

          description: "",

          specifications: "",

          seoTitle: "",

          seoDescription: "",

          seoKeywords: "",

          [field]: value,
        },
      ];
    });
  };

  const submit = () => {
    updateMutation.mutate({
      id,
      slug,
      imageUrl,
      categoryId,
      subCategoryId: subCategoryId || undefined,
      published,
      translations,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit Product</h1>

      <input value={slug} onChange={(e) => setSlug(e.target.value)} />

      <br />
      <br />

      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

      <br />
      <br />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.translations?.[0]?.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={subCategoryId}
        onChange={(e) => setSubCategoryId(e.target.value)}
      >
        <option value="">None</option>

        {subCategories?.map((s) => (
          <option key={s.id} value={s.id}>
            {s.translations?.[0]?.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      {languages?.map((lang) => {
        const translation = translations.find((t) => t.languageId === lang.id);

        return (
          <div
            key={lang.id}
            style={{
              border: "1px solid #ddd",
              marginBottom: 20,
              padding: 10,
            }}
          >
            <h3>{lang.code}</h3>
            <input
              placeholder="Slug"
              value={translation?.slug || ""}
              onChange={(e) =>
                updateTranslation(lang.id, "slug", e.target.value)
              }
            />
            <input
              value={translation?.name ?? ""}
              onChange={(e) =>
                updateTranslation(lang.id, "name", e.target.value)
              }
            />

            <br />

            <textarea
              value={translation?.description ?? ""}
              onChange={(e) =>
                updateTranslation(lang.id, "description", e.target.value)
              }
            />

            <br />

            <textarea
              value={translation?.specifications ?? ""}
              onChange={(e) =>
                updateTranslation(lang.id, "specifications", e.target.value)
              }
            />
          </div>
        );
      })}

      <button onClick={submit}>Update</button>
    </div>
  );
}
