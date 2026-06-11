"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subCategorySchema, SubCategoryFormValues } from "@/types/subCategory";
import { TranslationFields } from "./TranslationFields";

type Language = { id: string; code: string; name?: string };
type Category = { id: string; translations: { name: string }[] };

interface SubCategoryFormProps {
  defaultValues?: SubCategoryFormValues;
  languages: Language[];
  categories: Category[];
  onSubmit: (values: SubCategoryFormValues) => void;
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

export function SubCategoryForm({
  defaultValues,
  languages,
  categories,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: SubCategoryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: defaultValues ?? {
      categoryId: "",
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

  // initialize translations در create mode
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

  // reset کامل در edit mode وقتی data آمد
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20 }}>
      <div>
        <label>Category</label>
        <br />
        <select {...register("categoryId")}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.translations?.[0]?.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.categoryId.message}
          </span>
        )}
      </div>
      <br />

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
