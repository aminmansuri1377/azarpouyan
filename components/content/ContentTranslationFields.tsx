"use client";

import { Control, Controller, UseFormRegister } from "react-hook-form";
import { ContentFormValues } from "@/types/content";
import { RichTextEditor } from "./RichTextEditor";

interface Props {
  index: number;
  langCode: string;
  register: UseFormRegister<ContentFormValues>;
  control: Control<ContentFormValues>;
  errors?: {
    title?: { message?: string };
    body?: { message?: string };
  };
}

export function ContentTranslationFields({
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
        <label className="mb-2 block">عنوان</label>

        <input
          placeholder="عنوان مقاله"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          {...register(`${prefix}.title`)}
        />

        {errors?.title && (
          <span className="mt-1 block text-sm text-red-600">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block">Slug</label>

        <input
          dir="ltr"
          placeholder="article-slug"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          {...register(`${prefix}.slug`)}
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block">خلاصه مقاله</label>

        <textarea
          rows={3}
          placeholder="خلاصه‌ای کوتاه از مقاله"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          {...register(`${prefix}.excerpt`)}
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block">محتوای مقاله</label>

        <Controller
          name={`${prefix}.body`}
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />

        {errors?.body && (
          <span className="mt-1 block text-sm text-red-600">
            {errors.body.message}
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
