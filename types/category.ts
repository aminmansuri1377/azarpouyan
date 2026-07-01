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
  parentId: z.string().nullable().optional(), // null یا undefined = ریشه
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  published: z.boolean(),
  sortOrder: z.number().default(0),
  translations: z.array(categoryTranslationSchema),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

// نوع درختی برای نمایش (بازگشتی)
export type CategoryTreeNode = {
  id: string;
  slug: string;
  imageUrl: string;
  published: boolean;
  parentId: string | null;
  translations: { languageId: string; name: string; slug: string }[];
  children: CategoryTreeNode[];
};
