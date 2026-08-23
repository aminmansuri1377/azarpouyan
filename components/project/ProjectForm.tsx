"use client";

import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { projectSchema, type ProjectFormValues } from "@/types/project";
import { ProjectTranslationFields } from "./ProjectTranslationFields";
import { ImageUploader } from "@/components/ui/mageUploader";
import { MultiImageUploader } from "@/components/ui/MultiImageUploader";
import { Button } from "../ui";

type Language = {
  id: string;
  code: string;
  name?: string;
};

interface ProjectFormProps {
  defaultValues?: ProjectFormValues;
  languages: Language[];
  onSubmit: (values: ProjectFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const buildEmptyTranslation = (languageId: string) => ({
  languageId,
  name: "",
  slug: "",
  summary: "",
  specifications: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
});

export function ProjectForm({
  defaultValues,
  languages,
  onSubmit,
  isSubmitting = false,
  submitLabel = "ذخیره",
}: ProjectFormProps) {
  const initializedRef = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(
      projectSchema,
    ) as unknown as Resolver<ProjectFormValues>,
    shouldUnregister: false,
    defaultValues: defaultValues ?? {
      slug: "",
      imageUrl: "",
      images: [],
      published: true,
      translations: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "translations",
  });

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
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          فرم دارای خطا است. لطفاً فیلدهای اجباری (مانند نام، اسلاگ، تصویر اصلی و توضیحات) را بررسی و تکمیل کنید.
        </div>
      )}

      {/* Main Slug */}
      <div className="mb-6">
        <label className="mb-2 block font-medium">Slug اصلی (انگلیسی/یکتا)</label>
        <input
          dir="ltr"
          placeholder="project-slug"
          className="w-full rounded-lg border-2 border-primary px-4 py-2"
          {...register("slug")}
        />
        {errors.slug && (
          <span className="mt-1 block text-sm text-red-600">
            {errors.slug.message}
          </span>
        )}
      </div>

      {/* Main Image */}
      <div className="mx-auto mb-6 max-w-xl rounded-2xl border-2 border-primary p-4 text-center">
        <label className="mb-3 block font-bold">تصویر اصلی پروژه</label>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageUploader
              value={field.value}
              onChange={field.onChange}
              folder="projects"
              label="بارگذاری تصویر اصلی"
            />
          )}
        />
        {errors.imageUrl && (
          <span className="mt-2 block text-sm text-red-600">
            {errors.imageUrl.message}
          </span>
        )}
      </div>

      {/* Gallery Images */}
      <div className="mx-auto mb-6 max-w-xl rounded-2xl border-2 border-primary p-4 text-center">
        <label className="mb-3 block font-bold">گالری تصاویر پروژه</label>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <MultiImageUploader
              value={field.value ?? []}
              onChange={field.onChange}
              folder="projects"
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

      {/* Published Checkbox */}
      <div className="mb-6 flex items-center gap-2">
        <Controller
          name="published"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="published-checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="size-4 rounded border-gray-300 text-primary"
            />
          )}
        />
        <label htmlFor="published-checkbox" className="font-medium cursor-pointer">
          وضعیت انتشار (نمایش در سایت)
        </label>
      </div>

      <hr className="my-8 border-gray-300" />

      <h2 className="mb-6 text-xl font-bold">ترجمه‌های پروژه</h2>

      {fields.map((field, index) => {
        const language = languages.find((item) => item.id === field.languageId);
        const translationErrors = errors.translations?.[index];

        return (
          <ProjectTranslationFields
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
