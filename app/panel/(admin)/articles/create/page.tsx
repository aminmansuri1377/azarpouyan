"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ContentForm } from "@/components/content/ContentForm";
import type { ContentFormValues } from "@/types/content";

export default function CreateArticlePage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: languages = [] } = trpc.language.getAll.useQuery();

  const createMutation = trpc.content.create.useMutation({
    onSuccess: async () => {
      await utils.content.getAll.invalidate({ type: "ARTICLE" });
      router.push("/panel/articles");
    },
  });

  const handleSubmit = (values: ContentFormValues) => {
    createMutation.mutate({ ...values, type: "ARTICLE" });
  };

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>Create Article</h1>
      <ContentForm
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create"
      />
    </>
  );
}
