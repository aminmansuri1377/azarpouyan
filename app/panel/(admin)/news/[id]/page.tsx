"use client";

import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ContentForm } from "@/components/content/ContentForm";
import type { ContentFormValues } from "@/types/content";

export default function EditNewsPage() {
  const router = useRouter();
  const { id } = useParams<{
    id: string;
  }>();

  const utils = trpc.useUtils();

  const { data, isLoading, error, refetch } = trpc.content.getById.useQuery(
    { id },
    {
      enabled: !!id,
      retry: false,
    },
  );

  const { data: languages = [] } = trpc.language.getAll.useQuery();

  const updateMutation = trpc.content.update.useMutation({
    onSuccess: async () => {
      toast.success("خبر بروزرسانی شد");

      await utils.content.getAll.invalidate({
        type: "NEWS",
      });

      await utils.content.getById.invalidate({
        id,
      });

      router.push("/panel/news");
    },

    onError: (error) => {
      toast.error(error.message || "خطا در بروزرسانی خبر");
    },
  });

  if (isLoading) {
    return <div style={{ padding: 20 }}>در حال بارگذاری...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>خطا در دریافت اطلاعات خبر</h2>

        <p style={{ color: "red" }}>{error.message}</p>

        <button onClick={() => refetch()}>تلاش مجدد</button>
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: 20 }}>خبر پیدا نشد</div>;
  }

  const defaultValues = {
    slug: data.slug,
    coverImage: data.coverImage,
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
    published: data.published,
    publishedAt: data.publishedAt
      ? new Date(data.publishedAt).toISOString().slice(0, 16)
      : null,

    translations: data.translations.map((t) => ({
      languageId: t.languageId,
      title: t.title,
      slug: t.slug,
      excerpt: t.excerpt ?? "",
      body: t.body,
      seoTitle: t.seoTitle ?? "",
      seoDescription: t.seoDescription ?? "",
      seoKeywords: t.seoKeywords ?? "",
    })),
  };

  const handleSubmit = (values: ContentFormValues) => {
    updateMutation.mutate({
      id,
      ...values,
    });
  };

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>ویرایش خبر</h1>

      <ContentForm
        defaultValues={defaultValues}
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="بروزرسانی"
      />
    </>
  );
}
