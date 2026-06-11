"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormValues } from "@/types/category";
import { TranslationFields } from "./TranslationFields";

type Language = { id: string; code: string; name?: string };

interface CategoryFormProps {
  defaultValues?: CategoryFormValues;
  languages: Language[];
  onSubmit: (values: CategoryFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const buildEmptyTranslation = (languageId: string) => ({
  languageId,
  name: "",
  slug: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
});

export function CategoryForm({
  defaultValues,
  languages,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? {
      slug: "",
      imageUrl: "",
      published: true,
      translations: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "translations",
  });

  // initialize translations بعد از لود شدن languages
  useEffect(() => {
    if (!languages.length) return;

    const merged = languages.map((lang) => {
      const existing = defaultValues?.translations?.find(
        (t) => t.languageId === lang.id,
      );
      return existing ?? buildEmptyTranslation(lang.id);
    });

    replace(merged);
  }, [languages]);
  // نکته: defaultValues عمداً در dependency array نیست
  // چون فقط می‌خواهیم این effect هنگام mount و تغییر languages اجرا شود

  // وقتی data از سرور آمد (edit mode)، فرم را reset کن
  useEffect(() => {
    if (!defaultValues || !languages.length) return;

    const merged = languages.map((lang) => {
      const existing = defaultValues.translations?.find(
        (t) => t.languageId === lang.id,
      );
      return existing ?? buildEmptyTranslation(lang.id);
    });

    reset({
      ...defaultValues,
      translations: merged,
    });
  }, [defaultValues, reset]);
  // languages عمداً اینجا نیست تا loop نشود

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20 }}>
      <div>
        <label>Global Slug</label>
        <br />
        <input placeholder="slug" {...register("slug")} />
        {errors.slug && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.slug.message}
          </span>
        )}
      </div>
      <br />

      <div>
        <label>Image URL</label>
        <br />
        <input placeholder="image url" {...register("imageUrl")} />
        {errors.imageUrl && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.imageUrl.message}
          </span>
        )}
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
          <TranslationFields
            key={field.id}
            index={index}
            langCode={
              lang ? `${lang.name ?? ""} (${lang.code})` : field.languageId
            }
            register={register}
            errors={tErrors}
          />
        );
      })}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
