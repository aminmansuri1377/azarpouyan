import { UseFormRegister, FieldErrors, Path } from "react-hook-form";

// generic type T باید شامل translations باشد
interface TranslationFieldsProps<T extends { translations: any[] }> {
  index: number;
  langCode: string;
  register: UseFormRegister<T>;
  errors?: {
    name?: { message?: string };
    slug?: { message?: string };
  };
  // آیا فیلد description و specifications هم نمایش داده شود (برای product)
  withContent?: boolean;
}

// چون generic در JSX داریم، از فانکشن معمولی استفاده می‌کنیم
export function TranslationFields({
  index,
  langCode,
  register,
  errors,
  withContent = false,
}: {
  index: number;
  langCode: string;
  register: UseFormRegister<any>;
  errors?: {
    name?: { message?: string };
    slug?: { message?: string };
    description?: { message?: string };
    specifications?: { message?: string };
  };
  withContent?: boolean;
}) {
  const prefix = `translations.${index}`;

  return (
    <div className=" p-5 m-4 border border-primary">
      <h3>{langCode}</h3>

      {/* hidden field - languageId حتماً باید ارسال شود */}
      <input type="hidden" {...register(`${prefix}.languageId`)} />

      <div>
        <span className="mx-4">نام: </span>

        <input
          className="px-5 py-1 rounded-2xl border-2 border-primary"
          placeholder="Name"
          {...register(`${prefix}.name`)}
        />
        {errors?.name && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.name.message}
          </span>
        )}
      </div>
      <br />

      <div>
        <span className="mx-4">slug: </span>
        <input
          className="px-5 py-1 rounded-2xl border-2 border-primary"
          placeholder="Slug"
          {...register(`${prefix}.slug`)}
        />
        {errors?.slug && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.slug.message}
          </span>
        )}
      </div>
      <br />

      {withContent && (
        <>
          <div>
            <span className="mx-4">توضیحات: </span>

            <textarea
              className="px-5 py-1 rounded-2xl border-2 border-primary"
              placeholder="Description"
              {...register(`${prefix}.description`)}
            />
            {errors?.description && (
              <span style={{ color: "red", fontSize: 12 }}>
                {errors.description.message}
              </span>
            )}
          </div>
          <br />

          <div>
            <span className="mx-4">ویژگی: </span>
            <textarea
              placeholder="Specifications"
              className="px-5 py-1 rounded-2xl border-2 border-primary"
              {...register(`${prefix}.specifications`)}
            />
            {errors?.specifications && (
              <span style={{ color: "red", fontSize: 12 }}>
                {errors.specifications.message}
              </span>
            )}
          </div>
          <br />
        </>
      )}

      <span className="mx-4">SEO Title: </span>
      <input
        placeholder="SEO Title"
        className="px-5 py-1 rounded-2xl border-2 border-primary"
        {...register(`${prefix}.seoTitle`)}
      />
      <br />
      <br />
      <span className="mx-4">SEO Description: </span>
      <textarea
        placeholder="SEO Description"
        className="px-5 py-1 rounded-2xl border-2 border-primary"
        {...register(`${prefix}.seoDescription`)}
      />
      <br />
      <br />
      <span className="mx-4">SEO Keywords: </span>
      <input
        placeholder="SEO Keywords"
        className="px-5 py-1 rounded-2xl border-2 border-primary"
        {...register(`${prefix}.seoKeywords`)}
      />
    </div>
  );
}
