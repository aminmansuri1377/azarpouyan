"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

export default function CreateSubCategoryPage() {
  const router = useRouter();

  const { data: languages } = trpc.language.getAll.useQuery();

  const { data: categories } = trpc.category.getAll.useQuery();

  const createMutation = trpc.subCategory.create.useMutation({
    onSuccess: () => {
      router.push("/panel/subcategories");
    },
  });

  const [categoryId, setCategoryId] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  const [translations, setTranslations] = useState<any[]>([]);

  const updateTranslation = (
    languageId: string,
    field: string,
    value: string,
  ) => {
    setTranslations((prev) => {
      const existing = prev.find((x) => x.languageId === languageId);

      if (existing) {
        return prev.map((x) =>
          x.languageId === languageId ? { ...x, [field]: value } : x,
        );
      }

      return [
        ...prev,
        {
          languageId,
          name: "",
          slug: "",
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
          [field]: value,
        },
      ];
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create SubCategory</h1>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select Category</option>

        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.translations?.[0]?.name}
          </option>
        ))}
      </select>

      <br />
      <br />

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

      <label>
        Published
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
      </label>

      <hr />

      {languages?.map((lang) => (
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
            placeholder="name"
            onChange={(e) => updateTranslation(lang.id, "name", e.target.value)}
          />

          <br />

          <input
            placeholder="slug"
            onChange={(e) => updateTranslation(lang.id, "slug", e.target.value)}
          />

          <br />

          <input
            placeholder="seo title"
            onChange={(e) =>
              updateTranslation(lang.id, "seoTitle", e.target.value)
            }
          />

          <br />

          <input
            placeholder="seo description"
            onChange={(e) =>
              updateTranslation(lang.id, "seoDescription", e.target.value)
            }
          />

          <br />

          <input
            placeholder="seo keywords"
            onChange={(e) =>
              updateTranslation(lang.id, "seoKeywords", e.target.value)
            }
          />
        </div>
      ))}

      <button
        onClick={() =>
          createMutation.mutate({
            categoryId,
            slug,
            imageUrl,
            published,
            translations,
          })
        }
      >
        Create
      </button>
    </div>
  );
}
