import { z } from "zod";

export const contactRequestSchema = z.object({
  fullName: z.string().min(2, "نام الزامی است"),
  companyName: z.string().optional(),

  phone: z.string().optional(),

  email: z.string().optional(),

  subject: z.string().optional(),

  message: z.string().min(10, "پیام باید حداقل 10 کاراکتر باشد"),
});

export type ContactRequestFormValues = z.infer<typeof contactRequestSchema>;
