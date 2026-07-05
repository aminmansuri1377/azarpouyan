import { z } from "zod";
import { ContentType } from "@prisma/client";

export const contentTranslationSchema = z.object({
  languageId: z.string().min(1, "Required"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional(),
  slug: z.string().min(1),
  body: z.string().min(1, "Body is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export const contentSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  coverImage: z.string().min(1, "Cover image is required"),
  images: z.array(z.string()).default([]),
  published: z.boolean(),
  publishedAt: z.string().nullable().optional(),
  translations: z.array(contentTranslationSchema),
});

export type ContentFormValues = z.infer<typeof contentSchema>;

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  BLOG: "Blog",
  NEWS: "News",
  ARTICLE: "Article",
};

export { ContentType };
