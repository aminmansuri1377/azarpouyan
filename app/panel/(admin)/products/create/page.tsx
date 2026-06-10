"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { trpc } from "@/lib/trpc/client";

export default function CreateProductPage() {
  const router = useRouter();

  const utils = trpc.useUtils();

  const { data: languages } = trpc.language.getAll.useQuery();

  const { data: categories } = trpc.category.getAll.useQuery();

  const { data: subCategories } = trpc.subCategory.getAll.useQuery();

  const createMutation = trpc.product.create.useMutation({
    onSuccess: async () => {
      await utils.product.getAll.invalidate();

      router.push("/panel/products");
    },
  });

  const [slug, setSlug] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [subCategoryId, setSubCategoryId] = useState("");

  const [published, setPublished] = useState(true);

  const [translations, setTranslations] = useState<any[]>([]);

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
    createMutation.mutate({
      slug,
      imageUrl,
      categoryId,
      subCategoryId: subCategoryId || undefined,
      published,
      translations,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Product</h1>

      <input
        placeholder="slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="image url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <br />
      <br />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select Category</option>

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
        <option value="">No SubCategory</option>

        {subCategories?.map((s) => (
          <option key={s.id} value={s.id}>
            {s.translations?.[0]?.name}
          </option>
        ))}
      </select>

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
        const translation = translations.find((t) => t.languageId === lang.id);

        return (
          <div
            key={lang.id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginBottom: 20,
            }}
          >
            <h3>{lang.code}</h3>

            <input
              placeholder="Name"
              value={translation?.name || ""}
              onChange={(e) =>
                updateTranslation(lang.id, "name", e.target.value)
              }
            />

            <br />

            <input
              placeholder="Slug"
              value={translation?.slug || ""}
              onChange={(e) =>
                updateTranslation(lang.id, "slug", e.target.value)
              }
            />

            <br />

            <textarea
              placeholder="Description"
              value={translation?.description || ""}
              onChange={(e) =>
                updateTranslation(lang.id, "description", e.target.value)
              }
            />

            <br />

            <textarea
              placeholder="Specifications"
              value={translation?.specifications || ""}
              onChange={(e) =>
                updateTranslation(lang.id, "specifications", e.target.value)
              }
            />

            <br />

            <input
              placeholder="SEO Title"
              value={translation?.seoTitle || ""}
              onChange={(e) =>
                updateTranslation(lang.id, "seoTitle", e.target.value)
              }
            />

            <br />

            <input
              placeholder="SEO Description"
              value={translation?.seoDescription || ""}
              onChange={(e) =>
                updateTranslation(lang.id, "seoDescription", e.target.value)
              }
            />

            <br />

            <input
              placeholder="SEO Keywords"
              value={translation?.seoKeywords || ""}
              onChange={(e) =>
                updateTranslation(lang.id, "seoKeywords", e.target.value)
              }
            />
          </div>
        );
      })}

      <button onClick={submit}>Create</button>
    </div>
  );
}
