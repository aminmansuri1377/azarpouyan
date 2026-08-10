"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ContentForm } from "@/components/content/ContentForm";
import type { ContentFormValues } from "@/types/content";

export default function CreateBlogPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: languages = [], error: languagesError } =
    trpc.language.getAll.useQuery();

  const createMutation = trpc.content.create.useMutation({
    onSuccess: async () => {
      toast.success("بلاگ با موفقیت ایجاد شد");

      await utils.content.getAll.invalidate({
        type: "BLOG",
      });

      router.push("/panel/blogs");
    },

    onError: (error) => {
      toast.error(error.message || "خطا در ایجاد خبر");
    },
  });

  const handleSubmit = (values: ContentFormValues) => {
    createMutation.mutate({
      ...values,
      type: "BLOG",
    });
  };

  if (languagesError) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "red" }}>{languagesError.message}</p>
      </div>
    );
  }

  return (
    <div className=" font-peyda-regular text-right">
      <h1 style={{ padding: "20px 20px 0" }}>ایجاد بلاگ</h1>

      <ContentForm
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="ایجاد"
      />
    </div>
  );
}
