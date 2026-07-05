"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { priceTickerSchema, PriceTickerFormValues } from "@/types/priceTicker";
import { PriceTickerTranslationFields } from "./PriceTickerTranslationFields";

type Language = { id: string; code: string; name?: string };

interface PriceTickerFormProps {
  defaultValues?: PriceTickerFormValues;
  languages: Language[];
  onSubmit: (values: PriceTickerFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const buildEmptyTranslation = (languageId: string) => ({
  languageId,
  productName: "",
  price: "",
});

export function PriceTickerForm({
  defaultValues,
  languages,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: PriceTickerFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PriceTickerFormValues>({
    resolver: zodResolver(priceTickerSchema),
    defaultValues: defaultValues ?? {
      active: true,
      imageUrl: "",
      sortOrder: 0,
      translations: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "translations",
  });

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
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20 }}>
      <div>
        <label>Image URL (optional)</label>
        <br />
        <input placeholder="https://..." {...register("imageUrl")} />
      </div>
      <br />

      <div>
        <label>Sort Order</label>
        <br />
        <input
          type="number"
          min={0}
          {...register("sortOrder", { valueAsNumber: true })}
        />
        {errors.sortOrder && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.sortOrder.message}
          </span>
        )}
      </div>
      <br />

      <label>
        Active{" "}
        <Controller
          name="active"
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
          <PriceTickerTranslationFields
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
