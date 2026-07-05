import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "@/types/product";

interface Props {
  langId: string;
  langCode: string;
  index: number;
}

export function ProductTranslationFields({ langId, langCode, index }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const err = errors.translations?.[index];

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 20 }}>
      <h3>{langCode}</h3>

      {/* hidden field برای languageId */}
      <input type="hidden" {...register(`translations.${index}.languageId`)} />

      <div>
        <input placeholder="Name" {...register(`translations.${index}.name`)} />
        {err?.name && <span style={{ color: "red" }}>{err.name.message}</span>}
      </div>

      <div>
        <input placeholder="Slug" {...register(`translations.${index}.slug`)} />
        {err?.slug && <span style={{ color: "red" }}>{err.slug.message}</span>}
      </div>

      <div>
        <textarea
          placeholder="Description"
          {...register(`translations.${index}.description`)}
        />
        {err?.description && (
          <span style={{ color: "red" }}>{err.description.message}</span>
        )}
      </div>

      <div>
        <textarea
          placeholder="Specifications"
          {...register(`translations.${index}.specifications`)}
        />
        {err?.specifications && (
          <span style={{ color: "red" }}>{err.specifications.message}</span>
        )}
      </div>

      <input
        placeholder="SEO Title"
        {...register(`translations.${index}.seoTitle`)}
      />
      <input
        placeholder="SEO Description"
        {...register(`translations.${index}.seoDescription`)}
      />
      <input
        placeholder="SEO Keywords"
        {...register(`translations.${index}.seoKeywords`)}
      />
    </div>
  );
}
