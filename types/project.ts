import { z } from "zod";

export const projectTranslationSchema = z.object({
  languageId: z.string().min(1, "انتخاب زبان الزامی است"),
  name: z.string().min(1, "نام پروژه الزامی است"),
  slug: z.string().min(1, "Slug الزامی است"),
  summary: z.string().optional().default(""),
  specifications: z.string().optional().default(""),
  description: z.string().min(1, "توضیحات پروژه الزامی است"),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  seoKeywords: z.string().optional().default(""),
});

export const projectSchema = z.object({
  slug: z.string().min(1, "Slug اصلی الزامی است"),
  imageUrl: z.string().min(1, "تصویر اصلی الزامی است"),
  images: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  translations: z.array(projectTranslationSchema).min(1, "حداقل یک ترجمه الزامی است"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
export type ProjectTranslationFormValues = z.infer<typeof projectTranslationSchema>;
