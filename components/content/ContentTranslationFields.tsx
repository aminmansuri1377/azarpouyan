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
        <span className="mx-4">عنوان : </span>
        <input
          placeholder="Title"
          className="px-5 py-1 rounded-2xl border-2 border-primary"
          {...register(`${prefix}.title`)}
        />
        <span className="mx-4">slug : </span>

        <input
          placeholder="Slug"
          className="px-5 py-1 rounded-2xl border-2 border-primary"
          {...register(`${prefix}.slug`)}
        />

        {errors?.title && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.title.message}
          </span>
        )}
      </div>
      <br />

      <div className=" flex justify-end items-center">
        <span className="mx-4">موضوع : </span>

        <textarea
          className="px-5 py-1 rounded-2xl border-2 border-primary"
          placeholder="Excerpt"
          rows={2}
          {...register(`${prefix}.excerpt`)}
        />
      </div>
      <br />

      <div className=" flex justify-end items-center">
        <span className="mx-4">متن : </span>
        <textarea
          placeholder="Body"
          className="px-5 py-1 rounded-2xl border-2 border-primary"
          rows={6}
          {...register(`${prefix}.body`)}
        />
        {errors?.body && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.body.message}
          </span>
        )}
      </div>
      <br />

      <span className="mx-4">SEO Title : </span>
      <input
        placeholder="SEO Title"
        className="px-5 py-1 rounded-2xl border-2 border-primary"
        {...register(`${prefix}.seoTitle`)}
      />
      <br />
      <br />
      <span className="mx-4">SEO Description : </span>
      <textarea
        placeholder="SEO Description"
        className="px-5 py-1 rounded-2xl border-2 border-primary"
        rows={2}
        {...register(`${prefix}.seoDescription`)}
      />
      <br />
      <br />
      <span className="mx-4">SEO Keywords : </span>
      <input
        placeholder="SEO Keywords"
        className="px-5 py-1 rounded-2xl border-2 border-primary"
        {...register(`${prefix}.seoKeywords`)}
      />
    </div>
  );
}
