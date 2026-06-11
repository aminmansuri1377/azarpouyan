import { z } from "zod";

export const priceTickerTranslationSchema = z.object({
  languageId: z.string().min(1, "Required"),
  productName: z.string().min(1, "Product name is required"),
  price: z.string().min(1, "Price is required"),
});

export const priceTickerSchema = z.object({
  active: z.boolean(),
  imageUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0),
  translations: z.array(priceTickerTranslationSchema),
});

export type PriceTickerFormValues = z.infer<typeof priceTickerSchema>;
