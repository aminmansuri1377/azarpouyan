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
import { Button } from "../ui";

export function ContactForm() {
  const router = useRouter();

  const mutation = trpc.contactRequest.create.useMutation({
    onSuccess() {
      toast.success("پیام با موفقیت ارسال شد.");
      router.refresh();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm<ContactRequestFormValues>({
    resolver: zodResolver(contactRequestSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (values: ContactRequestFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <section className="py-16 px-4 font-peyda-medium">
      <div
        className="max-w-5xl mx-auto rounded-3xl p-10 md:px-14"
        style={{
          background: "linear-gradient(to left, #C8A24A, #F6DEA3)",
        }}
      >
        {/* عنوان */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {"تماس با ما"}
          </h2>
          <p className="text-gray-800 text-lg">
            {"شما می‌توانید در این قسمت ما با در تماس باشید"}
          </p>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* پیام خطا */}
          {Object.keys(errors).length > 0 && (
            <div className="rounded-xl border border-red-300 bg-red-50/90 p-3 text-sm text-red-600 text-center">
              {"ارسال پیام با شکست مواجه شد."}
            </div>
          )}

          {/* ردیف نام و ایمیل */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* نام و نام خانوادگی */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-right text-gray-800 font-medium mb-2"
              >
                {"نام و نام خانوادگی :"}
              </label>
              <input
                id="fullName"
                type="text"
                placeholder={"نام خود را وارد کنید"}
                className={`w-full px-5 py-3.5 rounded-lg bg-[#F0E4C4] border text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8A24A] focus:border-transparent transition-all ${
                  errors.fullName ? "border-red-400" : "border-[#D4B96A]"
                }`}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1 text-right">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* ایمیل */}
            <div>
              <label
                htmlFor="email"
                className="block text-right text-gray-800 font-medium mb-2"
              >
                {"ایمیل :"}
              </label>
              <input
                id="email"
                type="email"
                dir="ltr"
                placeholder="example@email.com"
                className={`w-full px-5 py-3.5 rounded-lg bg-[#F0E4C4] border text-gray-800 placeholder-gray-500 text-right focus:outline-none focus:ring-2 focus:ring-[#C8A24A] focus:border-transparent transition-all ${
                  errors.email ? "border-red-400" : "border-[#D4B96A]"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 text-right">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* ردیف شرکت و تلفن */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="companyName"
                className="block text-right text-gray-800 font-medium mb-2"
              >
                {"نام شرکت :"}
              </label>
              <input
                id="companyName"
                type="text"
                placeholder={"نام شرکت خود را وارد کنید"}
                className={`w-full px-5 py-3.5 rounded-lg bg-[#F0E4C4] border text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8A24A] focus:border-transparent transition-all ${
                  errors.companyName ? "border-red-400" : "border-[#D4B96A]"
                }`}
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-red-600 text-sm mt-1 text-right">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-right text-gray-800 font-medium mb-2"
              >
                {"تلفن :"}
              </label>
              <input
                id="phone"
                type="tel"
                dir="ltr"
                placeholder="09123456789"
                className={`w-full px-5 py-3.5 rounded-lg bg-[#F0E4C4] border text-gray-800 placeholder-gray-500 text-right focus:outline-none focus:ring-2 focus:ring-[#C8A24A] focus:border-transparent transition-all ${
                  errors.phone ? "border-red-400" : "border-[#D4B96A]"
                }`}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1 text-right">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div> */}

          {/* موضوع */}
          {/* <div>
            <label
              htmlFor="subject"
              className="block text-right text-gray-800 font-medium mb-2"
            >
              {"موضوع :"}
            </label>
            <input
              id="subject"
              type="text"
              placeholder={"موضوع پیام خود را وارد کنید"}
              className={`w-full px-5 py-3.5 rounded-lg bg-[#F0E4C4] border text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8A24A] focus:border-transparent transition-all ${
                errors.subject ? "border-red-400" : "border-[#D4B96A]"
              }`}
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-red-600 text-sm mt-1 text-right">
                {errors.subject.message}
              </p>
            )}
          </div> */}

          {/* پیام */}
          <div>
            {/* <label
              htmlFor="message"
              className="block text-right text-gray-800 font-medium mb-2"
            >
              {"پیام شما به پویان :"}
            </label> */}
            <textarea
              id="message"
              rows={8}
              placeholder={"پیام خود را بنویسید..."}
              className={`w-full px-5 py-4 rounded-lg bg-[#F0E4C4] border text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8A24A] focus:border-transparent transition-all resize-none ${
                errors.message ? "border-red-400" : "border-[#D4B96A]"
              }`}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-red-600 text-sm mt-1 text-right">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* دکمه ارسال */}
          <div className="flex justify-center">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "در حال ارسال..." : "ارسال اطلاعات"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
