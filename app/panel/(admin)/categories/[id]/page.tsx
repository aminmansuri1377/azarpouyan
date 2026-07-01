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
  const { data: allCategories = [] } = trpc.category.getAll.useQuery();

  const updateMutation = trpc.category.update.useMutation({
    onSuccess: async () => {
      await utils.category.getTree.invalidate();
      await utils.category.getAll.invalidate();
      await utils.category.getById.invalidate({ id });
      router.push("/panel/categories");
    },
  });

  const defaultValues = useMemo<CategoryFormValues | undefined>(() => {
    if (!data) return undefined;
    return {
      parentId: data.parentId,
      slug: data.slug,
      imageUrl: data.imageUrl,
      published: data.published,
      sortOrder: (data as any).sortOrder ?? 0,
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

  if (!id) return <div>Invalid ID</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>ویرایش کتگوری</h1>
      <CategoryForm
        key={data?.id}
        defaultValues={defaultValues}
        languages={languages}
        allCategories={allCategories}
        excludeId={id}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="بروزرسانی"
      />
    </>
  );
}
