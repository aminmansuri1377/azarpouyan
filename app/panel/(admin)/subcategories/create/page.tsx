"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { SubCategoryForm } from "@/components/SubCategoryForm";
import type { SubCategoryFormValues } from "@/types/subCategory";

export default function CreateSubCategoryPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: languages = [] } = trpc.language.getAll.useQuery();
  const { data: categories = [] } = trpc.category.getAll.useQuery();

  const createMutation = trpc.subCategory.create.useMutation({
    onSuccess: async () => {
      await utils.subCategory.getAll.invalidate();
      router.push("/panel/subcategories");
    },
  });

  const handleSubmit = (values: SubCategoryFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>Create SubCategory</h1>
      <SubCategoryForm
        languages={languages}
        categories={categories}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create"
      />
    </>
  );
}
