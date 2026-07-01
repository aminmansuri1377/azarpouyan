import { z } from "zod";

export const productTranslationSchema = z.object({
  languageId: z.string().min(1, "Required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  specifications: z.string().min(1, "Specifications is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export const productSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  images: z.array(z.string()).default([]),
  categoryId: z.string().min(1, "انتخاب کتگوری اجباری است"), // اجباری، هر عمقی از درخت
  published: z.boolean(),
  translations: z.array(productTranslationSchema),
});

export type ProductFormValues = z.infer<typeof productSchema>;
