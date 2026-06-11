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
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        marginBottom: 20,
      }}
    >
      <h3>{langCode}</h3>

      {/* hidden field - languageId حتماً باید ارسال شود */}
      <input type="hidden" {...register(`${prefix}.languageId`)} />

      <div>
        <input placeholder="Name" {...register(`${prefix}.name`)} />
        {errors?.name && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.name.message}
          </span>
        )}
      </div>
      <br />

      <div>
        <input placeholder="Slug" {...register(`${prefix}.slug`)} />
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
            <textarea
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
            <textarea
              placeholder="Specifications"
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

      <input placeholder="SEO Title" {...register(`${prefix}.seoTitle`)} />
      <br />
      <br />
      <textarea
        placeholder="SEO Description"
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
