"use client";

import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ProjectForm } from "@/components/project/ProjectForm";
import type { ProjectFormValues } from "@/types/project";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();

  const { data, isLoading, error, refetch } = trpc.project.getById.useQuery(
    { id },
    {
      enabled: Boolean(id),
      retry: false,
    },
  );

  const { data: languages = [], error: languagesError } =
    trpc.language.getAll.useQuery(undefined, {
      retry: false,
    });

  const updateMutation = trpc.project.update.useMutation({
    onSuccess: async () => {
      toast.success("پروژه با موفقیت بروزرسانی شد");
      await utils.project.getAll.invalidate();
      await utils.project.getById.invalidate({ id });
      router.push("/panel/projects");
    },
    onError: (err) => {
      toast.error(err.message || "خطا در بروزرسانی پروژه");
    },
  });

  if (!id) {
    return <div className="p-10 text-center font-peyda-regular">شناسه پروژه نامعتبر است</div>;
  }

  if (isLoading) {
    return <div className="p-10 text-center font-peyda-regular">در حال بارگذاری اطلاعات پروژه...</div>;
  }

  if (languagesError) {
    return (
      <div className="p-10 font-peyda-regular text-red-600">
        <h2>خطا در دریافت زبان‌ها</h2>
        <p>{languagesError.message}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 font-peyda-regular text-red-600">
        <h2>خطا در دریافت اطلاعات پروژه</h2>
        <p>{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className="p-10 text-center font-peyda-regular">پروژه مورد نظر پیدا نشد</div>;
  }

  const defaultValues: ProjectFormValues = {
    slug: data.slug,
    imageUrl: data.imageUrl,
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
    published: data.published,
    translations: data.translations.map((t) => ({
      languageId: t.languageId,
      name: t.name,
      slug: t.slug,
      summary: t.summary ?? "",
      specifications: t.specifications ?? "",
      description: t.description,
      seoTitle: t.seoTitle ?? "",
      seoDescription: t.seoDescription ?? "",
      seoKeywords: t.seoKeywords ?? "",
    })),
  };

  const handleSubmit = (values: ProjectFormValues) => {
    updateMutation.mutate({
      id,
      ...values,
    });
  };

  return (
    <div className="font-peyda-regular text-right p-6 md:p-10" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-peyda-bold text-foreground">ویرایش پروژه</h1>
        <p className="text-sm text-muted-foreground mt-1">
          اطلاعات و محتوای پروژه را ویرایش کنید.
        </p>
      </div>

      <ProjectForm
        defaultValues={defaultValues}
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="بروزرسانی پروژه"
      />
    </div>
  );
}
