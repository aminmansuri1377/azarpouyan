"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function Create() {
  const router = useRouter();

  const { data: languages } = trpc.language.getAll.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => {
      router.push("/panel/categories");
    },
  });

  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  const [translations, setTranslations] = useState<any[]>([]);

  const handleChange = (langId: string, field: string, value: string) => {
    setTranslations((prev) => {
      const existing = prev.find((t) => t.languageId === langId);

      if (!existing) {
        return [
          ...prev,
          {
            languageId: langId,
            name: "",
            slug: "",
            seoTitle: "",
            seoDescription: "",
            seoKeywords: "",
            [field]: value,
          },
        ];
      }

      return prev.map((t) =>
        t.languageId === langId ? { ...t, [field]: value } : t,
      );
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Category</h1>

      <input
        placeholder="slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <br />

      <input
        placeholder="image url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

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

      <h3>Translations</h3>

      {languages?.map((lang) => (
        <div key={lang.id}>
          <b>{lang.code}</b>

          <input
            placeholder="name"
            onChange={(e) => handleChange(lang.id, "name", e.target.value)}
          />

          <input
            placeholder="slug"
            onChange={(e) => handleChange(lang.id, "slug", e.target.value)}
          />
        </div>
      ))}

      <br />

      <button
        onClick={() =>
          createMutation.mutate({
            slug,
            imageUrl,
            published,
            translations,
          })
        }
      >
        Save
      </button>
    </div>
  );
}
