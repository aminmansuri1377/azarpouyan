"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/types/product";
import { trpc } from "@/lib/trpc/client";
import { TranslationFields } from "../site/TranslationFields";
import { CategoryCascadeSelect } from "../category/CategoryCascadeSelect";

interface ProductFormProps {
  defaultValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const buildEmptyTranslation = (languageId: string) => ({
  languageId,
  name: "",
  slug: "",
  description: "",
  specifications: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
});

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}: ProductFormProps) {
  const { data: languages = [] } = trpc.language.getAll.useQuery();
  const { data: categories = [] } = trpc.category.getAll.useQuery();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? {
      slug: "",
      imageUrl: "",
      images: [],
      categoryId: "",
      published: true,
      translations: [],
    },
  });

  const { fields, replace } = useFieldArray({ control, name: "translations" });
  const [newImageUrl, setNewImageUrl] = useState("");

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
    <form
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        console.log("VALIDATION ERRORS:", formErrors);
      })}
      style={{ padding: 20 }}
    >
      {Object.keys(errors).length > 0 && (
        <div
          style={{
            background: "#fee",
            padding: 10,
            marginBottom: 10,
            color: "red",
          }}
        >
          فرم دارای خطا است. لطفاً همه‌ی فیلدهای اجباری (شامل توضیحات و مشخصات
          فنی برای همه‌ی زبان‌ها) را پر کنید.
        </div>
      )}

      <div>
        <label>کتگوری (اجباری)</label>
        <br />
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <CategoryCascadeSelect
              categories={categories}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.categoryId && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.categoryId.message}
          </span>
        )}
      </div>
      <br />

      <div>
        <label>Slug</label>
        <br />
        <input placeholder="slug" {...register("slug")} />
        {errors.slug && (
          <span style={{ color: "red" }}>{errors.slug.message}</span>
        )}
      </div>
      <br />

      <div>
        <label>Main Image URL</label>
        <br />
        <input placeholder="image url" {...register("imageUrl")} />
        {errors.imageUrl && (
          <span style={{ color: "red" }}>{errors.imageUrl.message}</span>
        )}
      </div>
      <br />

      <div>
        <label>Gallery Images</label>
        <br />
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <div>
              <input
                placeholder="image url"
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
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        />
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
          <div
            key={field.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginBottom: 12,
              borderRadius: 6,
            }}
          >
            <TranslationFields
              index={index}
              langCode={
                lang ? `${lang.name ?? ""} (${lang.code})` : field.languageId
              }
              register={register}
              errors={tErrors}
            />

            {/* این دو فیلد مخصوص محصول هستن؛ در TranslationFields مشترک وجود ندارن */}
            <div style={{ marginTop: 8 }}>
              <label>Description</label>
              <br />
              <textarea
                rows={4}
                style={{ width: "100%" }}
                {...register(`translations.${index}.description` as const)}
              />
              {tErrors?.description && (
                <span style={{ color: "red", fontSize: 12 }}>
                  {tErrors.description.message}
                </span>
              )}
            </div>

            <div style={{ marginTop: 8 }}>
              <label>Specifications</label>
              <br />
              <textarea
                rows={4}
                style={{ width: "100%" }}
                {...register(`translations.${index}.specifications` as const)}
              />
              {tErrors?.specifications && (
                <span style={{ color: "red", fontSize: 12 }}>
                  {tErrors.specifications.message}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
