"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { CategoryForm } from "@/components/CategoryForm";
import type { CategoryFormValues } from "@/types/category";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.category.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  const { data: languages = [] } = trpc.language.getAll.useQuery();

  const updateMutation = trpc.category.update.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
      await utils.category.getById.invalidate({ id });
      router.push("/panel/categories");
    },
  });

  // defaultValues فقط وقتی data آماده است ساخته می‌شود
  const defaultValues = useMemo<CategoryFormValues | undefined>(() => {
    if (!data) return undefined;

    return {
      slug: data.slug,
      imageUrl: data.imageUrl,
      published: data.published,
      translations: data.translations.map((t) => ({
        languageId: t.languageId,
        name: t.name,
        slug: t.slug,
        seoTitle: t.seoTitle ?? "",
        seoDescription: t.seoDescription ?? "",
        seoKeywords: t.seoKeywords ?? "",
      })),
    };
  }, [data]);

  const handleSubmit = (values: CategoryFormValues) => {
    updateMutation.mutate({ id, ...values });
  };

  if (!id) return <div>Invalid Category ID</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>Edit Category</h1>
      <CategoryForm
        key={data?.id} // ← مهم: باعث می‌شود فرم هنگام لود data دوباره mount شود
        defaultValues={defaultValues}
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update"
      />
    </>
  );
}
