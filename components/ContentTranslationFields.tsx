import { UseFormRegister } from "react-hook-form";
import { ContentFormValues } from "@/types/content";

interface Props {
  index: number;
  langCode: string;
  register: UseFormRegister<ContentFormValues>;
  errors?: {
    title?: { message?: string };
    body?: { message?: string };
  };
}

export function ContentTranslationFields({
  index,
  langCode,
  register,
  errors,
}: Props) {
  const prefix = `translations.${index}` as const;

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
      <h3>{langCode}</h3>

      <input type="hidden" {...register(`${prefix}.languageId`)} />

      <div>
        <input placeholder="Title" {...register(`${prefix}.title`)} />
        <input placeholder="Slug" {...register(`${prefix}.slug`)} />

        {errors?.title && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.title.message}
          </span>
        )}
      </div>
      <br />

      <div>
        <textarea
          placeholder="Excerpt"
          rows={2}
          {...register(`${prefix}.excerpt`)}
        />
      </div>
      <br />

      <div>
        <textarea placeholder="Body" rows={6} {...register(`${prefix}.body`)} />
        {errors?.body && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.body.message}
          </span>
        )}
      </div>
      <br />

      <input placeholder="SEO Title" {...register(`${prefix}.seoTitle`)} />
      <br />
      <br />
      <textarea
        placeholder="SEO Description"
        rows={2}
        {...register(`${prefix}.seoDescription`)}
      />
      <br />
      <br />
      <input
        placeholder="SEO Keywords"
        {...register(`${prefix}.seoKeywords`)}
      />
    </div>
  );
}
