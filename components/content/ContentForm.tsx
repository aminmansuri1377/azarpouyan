"use client";

import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { contentSchema, type ContentFormValues } from "@/types/content";

import { ContentTranslationFields } from "./ContentTranslationFields";
import { ImageUploader } from "@/components/ui/mageUploader";
import { MultiImageUploader } from "@/components/ui/MultiImageUploader";
import { Button } from "../ui";

type Language = {
  id: string;
  code: string;
  name?: string;
};

interface ContentFormProps {
  defaultValues?: ContentFormValues;
  languages: Language[];
  onSubmit: (values: ContentFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const buildEmptyTranslation = (languageId: string) => ({
  languageId,
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
});

export function ContentForm({
  defaultValues,
  languages,
  onSubmit,
  isSubmitting = false,
  submitLabel = "ذخیره",
}: ContentFormProps) {
  const initializedRef = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(
      contentSchema,
    ) as unknown as Resolver<ContentFormValues>,

    /**
     * با unmount شدن یک فیلد، مقدارش از فرم حذف نشود
     */
    shouldUnregister: false,

    defaultValues: defaultValues ?? {
      slug: "",
      coverImage: "",
      images: [],
      published: false,
      publishedAt: "",
      translations: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "translations",
  });

  /**
   * مقداردهی اولیه ترجمه‌ها
   *
   * این effect فقط یک بار اجرا می‌شود.
   * بنابراین با تایپ کاربر دوباره replace اجرا نمی‌شود.
   */
  useEffect(() => {
    if (!languages.length) return;

    if (initializedRef.current) {
      return;
    }

    const mergedTranslations = languages.map((language) => {
      const existingTranslation = defaultValues?.translations?.find(
        (translation) => translation.languageId === language.id,
      );

      return existingTranslation ?? buildEmptyTranslation(language.id);
    });

    if (defaultValues) {
      reset({
        ...defaultValues,
        translations: mergedTranslations,
      });
    } else {
      replace(mergedTranslations);
    }

    initializedRef.current = true;
  }, [languages, defaultValues, reset, replace]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5" dir="rtl">
      {/* slug اصلی */}
      <div className="mb-6">
        <label className="mb-2 block">Slug اصلی</label>

        <input
          dir="ltr"
          placeholder="main-slug"
          className="w-full rounded-lg border-2 border-primary px-4 py-2"
          {...register("slug")}
        />

        {errors.slug && (
          <span className="mt-1 block text-sm text-red-600">
            {errors.slug.message}
          </span>
        )}
      </div>

      {/* تصویر کاور */}
      <div className="mx-auto mb-6 max-w-xl rounded-2xl border-2 border-primary p-4 text-center">
        <label className="mb-3 block">تصویر کاور</label>

        <Controller
          name="coverImage"
          control={control}
          render={({ field }) => (
            <ImageUploader
              value={field.value}
              onChange={field.onChange}
              folder="content"
              label="بارگذاری تصویر کاور"
            />
          )}
        />

        {errors.coverImage && (
          <span className="mt-2 block text-sm text-red-600">
            {errors.coverImage.message}
          </span>
        )}
      </div>

      {/* تصاویر گالری */}
      <div className="mx-auto mb-6 max-w-xl rounded-2xl border-2 border-primary p-4 text-center">
        <label className="mb-3 block">تصاویر گالری</label>

        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <MultiImageUploader
              value={field.value ?? []}
              onChange={field.onChange}
              folder="content"
              label="بارگذاری تصاویر گالری"
            />
          )}
        />

        {errors.images && (
          <span className="mt-2 block text-sm text-red-600">
            {String(errors.images.message)}
          </span>
        )}
      </div>

      {/* تاریخ انتشار */}
      <div className="mb-6">
        <label className="mb-2 block">تاریخ انتشار</label>

        <input
          type="datetime-local"
          className="rounded-lg border px-4 py-2"
          {...register("publishedAt")}
        />
      </div>

      {/* وضعیت انتشار */}
      <div className="mb-6 flex items-center gap-2">
        <Controller
          name="published"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
            />
          )}
        />

        <label>انتشار مقاله</label>
      </div>

      <hr className="my-8" />

      <h2 className="mb-6 text-xl font-bold">ترجمه‌های مقاله</h2>

      {fields.map((field, index) => {
        const language = languages.find((item) => item.id === field.languageId);

        const translationErrors = errors.translations?.[index];

        return (
          <ContentTranslationFields
            key={field.id}
            index={index}
            langCode={
              language
                ? `${language.name ?? ""} (${language.code})`
                : field.languageId
            }
            register={register}
            control={control}
            errors={translationErrors}
          />
        );
      })}

      <div className="mt-8">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "در حال ذخیره..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
