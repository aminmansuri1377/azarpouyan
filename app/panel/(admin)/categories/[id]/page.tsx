"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

type TranslationState = {
  languageId: string;
  name: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
};

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const utils = trpc.useUtils();
  const id = useMemo(() => {
    return params?.id as string;
  }, [params]);

  const { data: category, isLoading } = trpc.category.getById.useQuery(
    { id },
    {
      enabled: !!id,
    },
  );

  const { data: languages } = trpc.language.getAll.useQuery();

  const updateMutation = trpc.category.update.useMutation();
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  const [translations, setTranslations] = useState<TranslationState[]>([]);

  useEffect(() => {
    if (!category || !languages) return;

    setSlug(category.slug);
    setImageUrl(category.imageUrl);
    setPublished(category.published);

    const mergedTranslations: TranslationState[] = languages.map((lang) => {
      const existing = category.translations.find(
        (t) => t.languageId === lang.id,
      );

      return {
        languageId: lang.id,
        name: existing?.name ?? "",
        slug: existing?.slug ?? "",
        seoTitle: existing?.seoTitle ?? "",
        seoDescription: existing?.seoDescription ?? "",
        seoKeywords: existing?.seoKeywords ?? "",
      };
    });

    setTranslations(mergedTranslations);
  }, [category, languages]);

  const handleNameChange = (languageId: string, value: string) => {
    setTranslations((prev) =>
      prev.map((item) =>
        item.languageId === languageId
          ? {
              ...item,
              name: value,
            }
          : item,
      ),
    );
  };

  const handleSlugChange = (languageId: string, value: string) => {
    setTranslations((prev) =>
      prev.map((item) =>
        item.languageId === languageId
          ? {
              ...item,
              slug: value,
            }
          : item,
      ),
    );
  };

  const handleSeoTitleChange = (languageId: string, value: string) => {
    setTranslations((prev) =>
      prev.map((item) =>
        item.languageId === languageId
          ? {
              ...item,
              seoTitle: value,
            }
          : item,
      ),
    );
  };

  const handleSeoDescriptionChange = (languageId: string, value: string) => {
    setTranslations((prev) =>
      prev.map((item) =>
        item.languageId === languageId
          ? {
              ...item,
              seoDescription: value,
            }
          : item,
      ),
    );
  };

  const handleSeoKeywordsChange = (languageId: string, value: string) => {
    setTranslations((prev) =>
      prev.map((item) =>
        item.languageId === languageId
          ? {
              ...item,
              seoKeywords: value,
            }
          : item,
      ),
    );
  };

  const handleSubmit = async () => {
    try {
      await updateMutation.mutateAsync({
        id,
        slug,
        imageUrl,
        published,
        translations,
      });

      await utils.category.getAll.invalidate();

      router.push("/panel/categories");
    } catch (error) {
      console.error(error);
      alert("Failed to update category");
    }
  };

  if (!id) {
    return <div>Invalid Category ID</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit Category</h1>

      <hr />

      <div>
        <label>Global Slug</label>

        <br />

        <input value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>

      <br />

      <div>
        <label>Image URL</label>

        <br />

        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      <br />

      <div>
        <label>
          Published
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
        </label>
      </div>

      <hr />

      {languages?.map((lang) => {
        const translation = translations.find((t) => t.languageId === lang.id);

        if (!translation) return null;

        return (
          <div
            key={lang.id}
            style={{
              border: "1px solid #ccc",
              padding: 16,
              marginBottom: 20,
            }}
          >
            <h3>
              {lang.name} ({lang.code})
            </h3>

            <input
              placeholder="Name"
              value={translation.name}
              onChange={(e) => handleNameChange(lang.id, e.target.value)}
            />

            <br />
            <br />

            <input
              placeholder="Slug"
              value={translation.slug}
              onChange={(e) => handleSlugChange(lang.id, e.target.value)}
            />

            <br />
            <br />

            <input
              placeholder="SEO Title"
              value={translation.seoTitle ?? ""}
              onChange={(e) => handleSeoTitleChange(lang.id, e.target.value)}
            />

            <br />
            <br />

            <textarea
              placeholder="SEO Description"
              value={translation.seoDescription ?? ""}
              onChange={(e) =>
                handleSeoDescriptionChange(lang.id, e.target.value)
              }
            />

            <br />
            <br />

            <input
              placeholder="SEO Keywords"
              value={translation.seoKeywords ?? ""}
              onChange={(e) => handleSeoKeywordsChange(lang.id, e.target.value)}
            />
          </div>
        );
      })}

      <button disabled={updateMutation.isPending} onClick={handleSubmit}>
        {updateMutation.isPending ? "Updating..." : "Update Category"}
      </button>
    </div>
  );
}
