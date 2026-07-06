"use client";

import toast from "react-hot-toast";
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
      toast.success("پیام شما با موفقیت ارسال شد");

      router.refresh();
    },

    onError(error) {
      toast.error(error.message || "خطا در ارسال پیام");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactRequestFormValues>({
    resolver: zodResolver(contactRequestSchema),
  });

  const onSubmit = (values: ContactRequestFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: 600,
      }}
    >
      {Object.keys(errors).length > 0 && (
        <div
          style={{
            background: "#fee",
            color: "red",
            padding: 12,
            marginBottom: 15,
          }}
        >
          لطفاً خطاهای فرم را اصلاح کنید.
        </div>
      )}

      <input placeholder="نام و نام خانوادگی" {...register("fullName")} />

      {errors.fullName && (
        <p style={{ color: "red" }}>{errors.fullName.message}</p>
      )}

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

      {errors.message && (
        <p style={{ color: "red" }}>{errors.message.message}</p>
      )}

      <br />
      <br />

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "در حال ارسال..." : "ارسال"}
      </button>
    </form>
  );
}
