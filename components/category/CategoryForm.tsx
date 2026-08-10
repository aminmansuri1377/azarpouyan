"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormValues } from "@/types/category";
import { TranslationFields } from "../site/TranslationFields";
import { ImageUploader } from "../ui/mageUploader";
import { Button } from "../ui";

type Language = { id: string; code: string; name?: string };
type FlatCategory = {
  id: string;
  parentId: string | null;
  translations: { name: string }[];
};

interface CategoryFormProps {
  defaultValues?: CategoryFormValues;
  languages: Language[];
  allCategories: FlatCategory[]; // برای select والد
  excludeId?: string; // در حالت ویرایش، خود نود و زیرمجموعه‌هاش نباید در لیست والد باشن
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

// ساخت گزینه‌های select والد با تورفتگی بصری، بدون شامل شدن id مستثنی‌شده و نوادگانش
function buildParentOptions(
  all: FlatCategory[],
  excludeIds: Set<string>,
  parentId: string | null = null,
  depth = 0,
): { id: string; label: string }[] {
  return all
    .filter((c) => c.parentId === parentId && !excludeIds.has(c.id))
    .flatMap((c) => [
      {
        id: c.id,
        label: `${"— ".repeat(depth)}${c.translations?.[0]?.name ?? c.id}`,
      },
      ...buildParentOptions(all, excludeIds, c.id, depth + 1),
    ]);
}

function collectDescendantIdsLocal(
  all: FlatCategory[],
  rootId: string,
): Set<string> {
  const result = new Set<string>();
  const stack = [rootId];
  while (stack.length) {
    const current = stack.pop()!;
    for (const c of all) {
      if (c.parentId === current && !result.has(c.id)) {
        result.add(c.id);
        stack.push(c.id);
      }
    }
  }
  return result;
}

export function CategoryForm({
  defaultValues,
  languages,
  allCategories,
  excludeId,
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
    resolver: zodResolver(
      categorySchema,
    ) as unknown as Resolver<CategoryFormValues>,
    defaultValues: defaultValues ?? {
      parentId: null,
      slug: "",
      imageUrl: "",
      published: true,
      sortOrder: 0,
      translations: [],
    },
  });

  const { fields, replace } = useFieldArray({ control, name: "translations" });

  useEffect(() => {
    if (!languages.length) return;

    const merged = languages.map((lang) => {
      const existing = defaultValues?.translations?.find(
        (t) => t.languageId === lang.id,
      );

      return existing ?? buildEmptyTranslation(lang.id);
    });

    replace(merged);
  }, [languages, defaultValues, replace]);

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
  }, [defaultValues, languages, reset]);

  const excludeIds = excludeId
    ? new Set([
        excludeId,
        ...collectDescendantIdsLocal(allCategories, excludeId),
      ])
    : new Set<string>();
  const parentOptions = buildParentOptions(allCategories, excludeIds);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20 }}>
      <div>
        <label>کتگوری والد (اختیاری — خالی بگذارید برای کتگوری اصلی)</label>
        <br />
        <Controller
          name="parentId"
          control={control}
          render={({ field }) => (
            <select
              className=" bg-primary px-6 py-1 rounded-2xl my-3"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value || null)}
            >
              <option value="">— بدون والد (کتگوری اصلی) —</option>
              {parentOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>
      <br />

      <div>
        <label>main Slug </label>
        <br />
        <input
          placeholder="slug"
          className="px-5 py-1 rounded-2xl border-2 border-primary"
          {...register("slug")}
        />
        {errors.slug && (
          <span style={{ color: "red" }}>{errors.slug.message}</span>
        )}
      </div>
      <br />

      <div className=" border-2 border-primary rounded-2xl p-3 max-w-100 mx-auto text-center">
        <label>بارگذاری عکس</label>
        <br />
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageUploader
              value={field.value}
              onChange={field.onChange}
              folder="categories"
              label="تصویر کتگوری"
            />
          )}
        />
        {errors.imageUrl && (
          <span style={{ color: "red" }}>{errors.imageUrl.message}</span>
        )}{" "}
        {errors.imageUrl && (
          <span style={{ color: "red" }}>{errors.imageUrl.message}</span>
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
        return (
          <TranslationFields
            key={field.id}
            index={index}
            langCode={
              lang ? `${lang.name ?? ""} (${lang.code})` : field.languageId
            }
            register={register}
            errors={errors.translations?.[index]}
          />
        );
      })}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
