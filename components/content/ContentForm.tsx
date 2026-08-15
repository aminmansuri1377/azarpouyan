"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema, ContentFormValues } from "@/types/content";
import { ContentTranslationFields } from "./ContentTranslationFields";
import { ImageUploader } from "../../components/ui/mageUploader";
import { MultiImageUploader } from "@/components/ui/MultiImageUploader";
import { Button } from "../ui";

type Language = { id: string; code: string; name?: string };

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
  isSubmitting,
  submitLabel = "Save",
}: ContentFormProps) {
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

  // create mode: initialize translations وقتی languages لود شد
  useEffect(() => {
    if (!languages.length) return;

    const merged = languages.map((lang) => {
      const existing = defaultValues?.translations?.find(
        (translation) => translation.languageId === lang.id,
      );

      return existing ?? buildEmptyTranslation(lang.id);
    });

    replace(merged);
  }, [languages, defaultValues, replace]);

  // edit mode: reset کامل فرم وقتی defaultValues آمد
  useEffect(() => {
    if (!defaultValues || !languages.length) return;

    const merged = languages.map((lang) => {
      const existing = defaultValues.translations?.find(
        (translation) => translation.languageId === lang.id,
      );

      return existing ?? buildEmptyTranslation(lang.id);
    });

    reset({
      ...defaultValues,
      translations: merged,
    });
  }, [defaultValues, languages, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20 }}>
      <div>
        <label>main Slug</label>
        <br />
        <input
          placeholder="slug"
          className="px-5 py-1 rounded-2xl border-2 border-primary"
          {...register("slug")}
        />
        {errors.slug && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.slug.message}
          </span>
        )}
      </div>
      <br />

      <div className=" border-2 border-primary rounded-2xl p-3 max-w-100 mx-auto text-center">
        <label>بارگذاری عکس</label>{" "}
        <Controller
          name="coverImage"
          control={control}
          render={({ field }) => (
            <ImageUploader
              value={field.value}
              onChange={field.onChange}
              folder="content"
              label="تصویر کاور"
            />
          )}
        />
        {errors.coverImage && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.coverImage.message}
          </span>
        )}
      </div>
      <br />

      <div className=" border-2 border-primary rounded-2xl p-3 max-w-100 mx-auto text-center">
        <label>بارگذاری عکس های گالری</label>{" "}
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <MultiImageUploader
              value={field.value ?? []}
              onChange={field.onChange}
              folder="content"
              label="گالری تصاویر"
            />
          )}
        />
        {errors.images && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.images.message as string}
          </span>
        )}
      </div>
      <br />

      <div>
        <label>: تاریخ انتشار</label>
        <br />
        <input type="datetime-local" {...register("publishedAt")} />
      </div>
      <br />

      <label>
        Published{" "}
        <Controller
          name="published"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </label>

      <hr />
      <h3>Translations</h3>

      {fields.map((field, index) => {
        const lang = languages.find((l) => l.id === field.languageId);
        const tErrors = errors.translations?.[index];

        return (
          <ContentTranslationFields
            key={field.id}
            index={index}
            langCode={
              lang ? `${lang.name ?? ""} (${lang.code})` : field.languageId
            }
            register={register}
            control={control}
            errors={tErrors}
          />
        );
      })}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
