"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  contactRequestSchema,
  ContactRequestFormValues,
} from "@/types/contactRequest";

import { trpc } from "@/lib/trpc/client";

export function ContactForm() {
  const router = useRouter();

  const mutation = trpc.contactRequest.create.useMutation({
    onSuccess() {
      alert("پیام شما با موفقیت ارسال شد");

      router.refresh();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactRequestFormValues>({
    resolver: zodResolver(contactRequestSchema),
  });

  const onSubmit = (values: ContactRequestFormValues) => {
    mutation.mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: 600,
      }}
    >
      <input placeholder="نام و نام خانوادگی" {...register("fullName")} />

      <br />
      <br />

      <input placeholder="نام شرکت" {...register("companyName")} />

      <br />
      <br />

      <input placeholder="شماره تماس" {...register("phone")} />

      <br />
      <br />

      <input placeholder="ایمیل" {...register("email")} />

      <br />
      <br />

      <input placeholder="موضوع" {...register("subject")} />

      <br />
      <br />

      <textarea rows={8} placeholder="پیام" {...register("message")} />

      <br />
      <br />

      <button type="submit" disabled={mutation.isPending}>
        ارسال
      </button>

      <br />

      {errors.message && <p>{errors.message.message}</p>}
    </form>
  );
}
