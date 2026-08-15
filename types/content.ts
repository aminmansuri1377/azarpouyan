import { z } from "zod";
import type { ContentType } from "@prisma/client";

export const contentTranslationSchema = z.object({
  languageId: z.string().min(1),
  title: z.string().min(1, "عنوان الزامی است"),
  slug: z.string().min(1, "Slug الزامی است"),
  excerpt: z.string().optional().default(""),
  body: z.string().min(1, "محتوا الزامی است"),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  seoKeywords: z.string().optional().default(""),
});

export const contentSchema = z.object({
  slug: z.string().min(1, "Slug اصلی الزامی است"),
  coverImage: z.string().min(1, "تصویر کاور الزامی است"),
  images: z.array(z.string()).default([]),
  published: z.boolean(),
  publishedAt: z.string().nullable().optional(),
  translations: z.array(contentTranslationSchema).min(1),
});

export type ContentFormValues = z.infer<typeof contentSchema>;

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  BLOG: "Blog",
  NEWS: "News",
  ARTICLE: "Article",
};

export type { ContentType };
