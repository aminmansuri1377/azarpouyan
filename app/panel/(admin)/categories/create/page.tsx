"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { CategoryForm } from "@/components/CategoryForm";
import type { CategoryFormValues } from "@/types/category";

export default function CreateCategoryPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: languages = [] } = trpc.language.getAll.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
      router.push("/panel/categories");
    },
  });

  const handleSubmit = (values: CategoryFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>Create Category</h1>
      <CategoryForm
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create"
      />
    </>
  );
}
