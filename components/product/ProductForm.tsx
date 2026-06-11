"use client";

import { useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "@/types/product";
import { TranslationFields } from "./TranslationFields";
import { trpc } from "@/lib/trpc/client";

interface Language {
  id: string;
  code: string;
}

interface ProductFormProps {
  // اگر defaultValues داریم یعنی edit mode
  defaultValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
  isLoading?: boolean;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const { data: languages } = trpc.language.getAll.useQuery();
  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: subCategories } = trpc.subCategory.getAll.useQuery();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? {
      slug: "",
      imageUrl: "",
      categoryId: "",
      subCategoryId: null,
      published: true,
      translations: [],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const { fields, replace } = useFieldArray({
    control,
    name: "translations",
  });

  // وقتی زبان‌ها لود شدن، برای هر زبان یک ترنسلیشن ایجاد کن
  // (اگر edit mode هست، مقادیر موجود رو حفظ کن)
  useEffect(() => {
    if (!languages) return;

    replace(
      languages.map((lang) => {
        const existing = defaultValues?.translations.find(
          (t) => t.languageId === lang.id,
        );
        return (
          existing ?? {
            languageId: lang.id,
            slug: "",
            name: "",
            description: "",
            specifications: "",
            seoTitle: "",
            seoDescription: "",
            seoKeywords: "",
          }
        );
      }),
    );
  }, [languages]); // eslint-disable-line react-hooks/exhaustive-deps
  // توجه: defaultValues عمداً از deps حذف شده تا فقط یک‌بار اجرا شه

  // اگر edit mode هست و data بعداً لود شد، فرم رو reset کن
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <div style={{ padding: 20 }}>
        <div>
          <input placeholder="Slug" {...register("slug")} />
          {errors.slug && (
            <span style={{ color: "red" }}>{errors.slug.message}</span>
          )}
        </div>

        <br />

        <div>
          <input placeholder="Image URL" {...register("imageUrl")} />
          {errors.imageUrl && (
            <span style={{ color: "red" }}>{errors.imageUrl.message}</span>
          )}
        </div>

        <br />

        <select {...register("categoryId")}>
          <option value="">Select Category</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.translations?.[0]?.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <span style={{ color: "red" }}>{errors.categoryId.message}</span>
        )}

        <br />
        <br />

        <select {...register("subCategoryId")}>
          <option value="">No SubCategory</option>
          {subCategories?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.translations?.[0]?.name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>
          Published
          <input type="checkbox" {...register("published")} />
        </label>

        <hr />

        {fields.map((field, index) => {
          const lang = languages?.find((l) => l.id === field.languageId);
          if (!lang) return null;
          return (
            <TranslationFields
              key={field.id}
              langId={lang.id}
              langCode={lang.code}
              index={index}
            />
          );
        })}

        <button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </FormProvider>
  );
}