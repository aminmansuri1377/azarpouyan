"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema, ContentFormValues } from "@/types/content";
import { ContentTranslationFields } from "./ContentTranslationFields";

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
    resolver: zodResolver(contentSchema) as unknown as Resolver<ContentFormValues>,
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
  const [newImageUrl, setNewImageUrl] = useState("");
  // create mode: initialize translations وقتی languages لود شد
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

  // edit mode: reset کامل فرم وقتی defaultValues آمد
  useEffect(() => {
    if (!defaultValues || !languages.length) return;
    const merged = languages.map((lang) => {
      const existing = defaultValues.translations?.find(
        (t) => t.languageId === lang.id,
      );
      return existing ?? buildEmptyTranslation(lang.id);
    });
    reset({ ...defaultValues, translations: merged });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20 }}>
      <div>
        <label>Slug</label>
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
        <label>Cover Image URL</label>
        <br />
        <input placeholder="https://..." {...register("coverImage")} />
        {errors.coverImage && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.coverImage.message}
          </span>
        )}
      </div>
      <h3>Gallery Images</h3>
      <br />
      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <div>
            <input
              placeholder="Gallery Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                if (!newImageUrl) return;
                field.onChange([...(field.value ?? []), newImageUrl]);
                setNewImageUrl("");
              }}
            >
              افزودن
            </button>
            <ul>
              {(field.value ?? []).map((url, i) => (
                <li key={i}>
                  {url}{" "}
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(
                        field.value.filter((_, idx) => idx !== i),
                      )
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      />

      <div>
        <label>Published At</label>
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
