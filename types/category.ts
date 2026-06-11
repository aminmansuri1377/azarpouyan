import { z } from "zod";

export const categoryTranslationSchema = z.object({
  languageId: z.string().min(1, "Required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export const categorySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  published: z.boolean(),
  translations: z.array(categoryTranslationSchema),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
