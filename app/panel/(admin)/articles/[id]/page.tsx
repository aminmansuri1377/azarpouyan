"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { ContentForm } from "@/components/ContentForm";
import type { ContentFormValues } from "@/types/content";

export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.content.getById.useQuery(
    { id },
    { enabled: !!id },
  );
  const { data: languages = [] } = trpc.language.getAll.useQuery();

  const updateMutation = trpc.content.update.useMutation({
    onSuccess: async () => {
      await utils.content.getAll.invalidate({ type: "ARTICLE" });
      await utils.content.getById.invalidate({ id });
      router.push("/panel/articles");
    },
  });

  const defaultValues = useMemo<ContentFormValues | undefined>(() => {
    if (!data) return undefined;
    return {
      slug: data.slug,
      coverImage: data.coverImage,
      published: data.published,
      publishedAt: data.publishedAt
        ? new Date(data.publishedAt).toISOString().slice(0, 16)
        : "",
      translations: data.translations.map((t) => ({
        languageId: t.languageId,
        title: t.title,
        excerpt: t.excerpt ?? "",
        body: t.body,
        seoTitle: t.seoTitle ?? "",
        seoDescription: t.seoDescription ?? "",
        seoKeywords: t.seoKeywords ?? "",
      })),
    };
  }, [data]);

  const handleSubmit = (values: ContentFormValues) => {
    updateMutation.mutate({ id, ...values });
  };

  if (!id) return <div>Invalid ID</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>Edit Article</h1>
      <ContentForm
        key={data?.id}
        defaultValues={defaultValues}
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update"
      />
    </>
  );
}
