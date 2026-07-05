import { UseFormRegister } from "react-hook-form";
import { PriceTickerFormValues } from "@/types/priceTicker";

interface Props {
  index: number;
  langCode: string;
  register: UseFormRegister<PriceTickerFormValues>;
  errors?: {
    productName?: { message?: string };
    price?: { message?: string };
  };
}

export function PriceTickerTranslationFields({
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
        <input
          placeholder="Product Name"
          {...register(`${prefix}.productName`)}
        />
        {errors?.productName && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.productName.message}
          </span>
        )}
      </div>
      <br />

      <div>
        <input placeholder="Price" {...register(`${prefix}.price`)} />
        {errors?.price && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.price.message}
          </span>
        )}
      </div>
    </div>
  );
}
