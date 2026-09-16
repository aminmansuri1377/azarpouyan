import { z } from "zod";

export const COMMENT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const COMMENT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const commentInput = z.object({
  fullName: z.string().trim().min(1, "نام کامل الزامی است.").max(150),
  companyName: z
    .string()
    .trim()
    .max(200)
    .transform((value) => value || null),
  text: z.string().trim().min(1, "متن نظر الزامی است.").max(5000),
  imageUrl: z
    .string()
    .max(1000)
    .regex(
      /^\/api\/image\/comments\/[a-zA-Z0-9_.-]+\.(?:jpe?g|png|webp|gif)$/i,
      "تصویر نظردهنده را بارگذاری کنید.",
    ),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(1000000),
});

export type CommentValues = z.input<typeof commentInput>;
