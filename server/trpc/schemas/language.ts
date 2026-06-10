import { z } from "zod";

export const createLanguageSchema = z.object({
  code: z.string().min(2).max(10).toLowerCase(),

  name: z.string().min(1).max(100),
});

export const updateLanguageSchema = z.object({
  id: z.string(),

  code: z.string(),

  name: z.string(),

  enabled: z.boolean(),

  sortOrder: z.number(),
});

export const deleteLanguageSchema = z.object({
  id: z.string(),
});
