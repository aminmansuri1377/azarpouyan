"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { SubCategoryForm } from "@/components/SubCategoryForm";
import type { SubCategoryFormValues } from "@/types/subCategory";

export default function EditSubCategoryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.subCategory.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  const { data: languages = [] } = trpc.language.getAll.useQuery();
  const { data: categories = [] } = trpc.category.getAll.useQuery();

  const updateMutation = trpc.subCategory.update.useMutation({
    onSuccess: async () => {
      await utils.subCategory.getAll.invalidate();
      await utils.subCategory.getById.invalidate({ id });
      router.push("/panel/subcategories");
    },
  });

  const defaultValues = useMemo<SubCategoryFormValues | undefined>(() => {
    if (!data) return undefined;

    return {
      categoryId: data.categoryId,
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

  const handleSubmit = (values: SubCategoryFormValues) => {
    updateMutation.mutate({ id, ...values });
  };

  if (!id) return <div>Invalid ID</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>Edit SubCategory</h1>
      <SubCategoryForm
        key={data?.id} // ← مهم
        defaultValues={defaultValues}
        languages={languages}
        categories={categories}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update"
      />
    </>
  );
}
