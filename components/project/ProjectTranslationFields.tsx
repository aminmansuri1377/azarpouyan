"use client";

import { Control, Controller, UseFormRegister } from "react-hook-form";
import { ProjectFormValues } from "@/types/project";
import { RichTextEditor } from "../content/RichTextEditor";

interface Props {
  index: number;
  langCode: string;
  register: UseFormRegister<ProjectFormValues>;
  control: Control<ProjectFormValues>;
  errors?: {
    name?: { message?: string };
    slug?: { message?: string };
    summary?: { message?: string };
    specifications?: { message?: string };
    description?: { message?: string };
  };
}

export function ProjectTranslationFields({
  index,
  langCode,
  register,
  control,
  errors,
}: Props) {
  const prefix = `translations.${index}` as const;

  return (
    <div className="mb-6 rounded-xl border border-gray-300 bg-gray-50 p-5">
      <h3 className="mb-5 text-lg font-bold">{langCode}</h3>

      <input type="hidden" {...register(`${prefix}.languageId`)} />

      <div className="mb-4">
        <label className="mb-2 block font-medium">نام پروژه (اجباری)</label>
        <input
          placeholder="نام پروژه"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          {...register(`${prefix}.name`)}
        />
        {errors?.name && (
          <span className="mt-1 block text-sm text-red-600">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium">Slug (اجباری)</label>
        <input
          dir="ltr"
          placeholder="project-slug"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          {...register(`${prefix}.slug`)}
        />
        {errors?.slug && (
          <span className="mt-1 block text-sm text-red-600">
            {errors.slug.message}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium">خلاصه پروژه</label>
        <textarea
          rows={3}
          placeholder="خلاصه‌ای کوتاه درباره پروژه..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          {...register(`${prefix}.summary`)}
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium">مشخصات کلیدی پروژه</label>
        <p className="mb-2 text-xs text-gray-500">
          هر مشخصه را در یک خط بنویسید (مثلاً: موقعیت پروژه: مشکین‌دشت، استان البرز)
        </p>
        <textarea
          rows={5}
          placeholder="نام پروژه: پردیس پویان&#10;موقعیت پروژه: مشکین‌دشت، استان البرز&#10;تعداد واحدهای مسکونی: ۲۴۵ واحد&#10;تعداد بلوک‌های مسکونی: ۷ بلوک&#10;مساحت زمین پروژه: ۷۶۰۰ مترمربع"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          {...register(`${prefix}.specifications`)}
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium">توضیحات کامل پروژه (TipTap)</label>
        <Controller
          name={`${prefix}.description`}
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="توضیحات و محتوای دلخواه پروژه را اینجا وارد کنید..."
            />
          )}
        />
        {errors?.description && (
          <span className="mt-1 block text-sm text-red-600">
            {errors.description.message}
          </span>
        )}
      </div>

      <details className="rounded-lg border bg-white p-4">
        <summary className="cursor-pointer font-bold">تنظیمات SEO</summary>

        <div className="mt-4">
          <label className="mb-2 block">SEO Title</label>
          <input
            className="w-full rounded-lg border px-4 py-2"
            {...register(`${prefix}.seoTitle`)}
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block">SEO Description</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border px-4 py-2"
            {...register(`${prefix}.seoDescription`)}
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block">SEO Keywords</label>
          <input
            className="w-full rounded-lg border px-4 py-2"
            {...register(`${prefix}.seoKeywords`)}
          />
        </div>
      </details>
    </div>
  );
}
