import { z } from "zod";

export const translationSchema = z.object({
  languageId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  specifications: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export const productSchema = z.object({
  slug: z.string().min(1),

  imageUrl: z.string().min(1),

  images: z.array(z.string()).default([]),

  categoryId: z.string().min(1),

  subCategoryId: z.string().nullable().optional(),

  published: z.boolean(),

  translations: z.array(translationSchema),
});

export type ProductFormValues = z.infer<typeof productSchema>;
