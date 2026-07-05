"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ContentForm } from "@/components/content/ContentForm";
import type { ContentFormValues } from "@/types/content";

export default function CreateBlogPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: languages = [] } = trpc.language.getAll.useQuery();

  const createMutation = trpc.content.create.useMutation({
    onSuccess: async () => {
      await utils.content.getAll.invalidate({ type: "BLOG" });
      router.push("/panel/blogs");
    },
  });

  const handleSubmit = (values: ContentFormValues) => {
    createMutation.mutate({ ...values, type: "BLOG" });
  };

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>Create Blog</h1>
      <ContentForm
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create"
      />
    </>
  );
}
