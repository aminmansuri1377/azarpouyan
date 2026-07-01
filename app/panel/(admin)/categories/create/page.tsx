"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { CategoryForm } from "@/components/CategoryForm";
import type { CategoryFormValues } from "@/types/category";

export default function CreateCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId");
  const utils = trpc.useUtils();

  const { data: languages = [] } = trpc.language.getAll.useQuery();
  const { data: allCategories = [] } = trpc.category.getAll.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onSuccess: async () => {
      await utils.category.getTree.invalidate();
      await utils.category.getAll.invalidate();
      router.push("/panel/categories");
    },
  });

  const handleSubmit = (values: CategoryFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>افزودن کتگوری</h1>
      <CategoryForm
        languages={languages}
        allCategories={allCategories}
        defaultValues={
          parentId
            ? {
                parentId,
                slug: "",
                imageUrl: "",
                published: true,
                sortOrder: 0,
                translations: [],
              }
            : undefined
        }
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="ایجاد"
      />
    </>
  );
}
