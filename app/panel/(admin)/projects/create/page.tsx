"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ProjectForm } from "@/components/project/ProjectForm";
import type { ProjectFormValues } from "@/types/project";

export default function CreateProjectPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: languages = [], error: languagesError } =
    trpc.language.getAll.useQuery();

  const createMutation = trpc.project.create.useMutation({
    onSuccess: async () => {
      toast.success("پروژه با موفقیت ایجاد شد");
      await utils.project.getAll.invalidate();
      router.push("/panel/projects");
    },
    onError: (error) => {
      toast.error(error.message || "خطا در ایجاد پروژه");
    },
  });

  const handleSubmit = (values: ProjectFormValues) => {
    createMutation.mutate(values);
  };

  if (languagesError) {
    return (
      <div className="p-6 text-red-600 font-peyda-regular" dir="rtl">
        <p>خطا در دریافت زبان‌ها: {languagesError.message}</p>
      </div>
    );
  }

  return (
    <div className="font-peyda-regular text-right p-6 md:p-10" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-peyda-bold text-foreground">ایجاد پروژه جدید</h1>
        <p className="text-sm text-muted-foreground mt-1">
          مشخصات و توضیحات پروژه را برای زبان‌های مختلف تکمیل کنید.
        </p>
      </div>

      <ProjectForm
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="ایجاد پروژه"
      />
    </div>
  );
}
