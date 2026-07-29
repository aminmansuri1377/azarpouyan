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
import { getMessages } from "@/messages";

import { Button, Form, FormField, Input } from "@/components/ui";

export function ContactForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = getMessages(locale);

  const mutation = trpc.contactRequest.create.useMutation({
    onSuccess() {
      toast.success(t.notif.contactMessageSentSuccessfully);
      router.refresh();
    },
    onError(error) {
      toast.error(error.message || t.notif.contactMessageSendFailed);
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
    <section className="relative isolate overflow-hidden py-24">
      {/* Background image + dark overlay — replace the url() with your asset */}

      <div className="mx-auto max-w-[1100px] px-6 text-center">
        <div className="mt-16 grid gap-6 text-right md:grid-cols-2">
          {/* Consultation request form */}
          <div className="order-2 rounded-[40px] bg-white/20 p-10 backdrop-blur-sm md:order-1">
            <h2 className="mb-8 text-center font-peyda-bold text-3xl text-white">
              {t.ConsultationRequestForm}
            </h2>

            <Form
              form={form}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {Object.keys(errors).length > 0 && (
                <div className="rounded-2xl border border-red-300 bg-red-50/90 p-3 text-sm text-red-600">
                  {t.notif.contactMessageSendFailed}
                </div>
              )}

              <FormField htmlFor="fullName" error={errors.fullName?.message}>
                <Input
                  id="fullName"
                  variant="glass"
                  placeholder={t.nameandSurname}
                  error={!!errors.fullName}
                  {...register("fullName")}
                />
              </FormField>

              <FormField htmlFor="phone" error={errors.phone?.message}>
                <Input
                  id="phone"
                  variant="glass"
                  placeholder={t.phoneNumber}
                  error={!!errors.phone}
                  {...register("phone")}
                />
              </FormField>

              <FormField htmlFor="email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  variant="glass"
                  placeholder={t.email}
                  error={!!errors.email}
                  {...register("email")}
                />
              </FormField>

              <FormField
                htmlFor="companyName"
                error={errors.companyName?.message}
              >
                <Input
                  id="companyName"
                  variant="glass"
                  placeholder={t.companyName}
                  error={!!errors.companyName}
                  {...register("companyName")}
                />
              </FormField>

              <FormField htmlFor="message" error={errors.message?.message}>
                <Input
                  id="message"
                  variant="glass"
                  placeholder={t.message}
                  error={!!errors.message}
                  {...register("message")}
                />
              </FormField>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full rounded-2xl bg-[#D7A53A] py-3 font-peyda-regular text-white hover:bg-[#c4952f]"
              >
                {mutation.isPending ? "در حال ارسال..." : "ثبت درخواست"}
              </Button>
            </Form>
          </div>

          {/* Contact info */}
          <div className="order-1 rounded-[40px] bg-white/20 p-10 backdrop-blur-sm md:order-2">
            <h2 className="mb-8 text-center font-peyda-bold text-3xl text-white">
              {t.contactInfo}
            </h2>

            <ul className="space-y-8">
              <li className="flex items-center justify-center gap-4 text-white">
                <span className="font-peyda-medium text-lg">0912-1234-123</span>
              </li>
              <li className="flex items-center justify-center gap-4 text-white">
                <span className="font-peyda-medium text-lg">0912-1234-123</span>
              </li>
              <li className="flex items-center justify-center gap-4 text-white">
                <span className="font-peyda-medium text-lg">@INFO . KIAN</span>
              </li>
              <li className="flex items-center justify-center gap-4 text-white">
                <span className="font-peyda-medium text-lg">WWW.SITE.COM</span>
              </li>
              <li className="flex items-center justify-center gap-4 text-white">
                <span className="font-peyda-medium text-lg">INSTAGRAM.COM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
