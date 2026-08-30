"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import { trpc } from "@/lib/trpc/client";
import { ArticleContent } from "@/components/content/ArticleContent";

export default function BlogSinglePage() {
  const params = useParams<{
    locale: string;
    slug: string;
  }>();

  const locale = params.locale;
  const slug = params.slug;

  const { data, isLoading, isError, error } =
    trpc.public.getContentBySlug.useQuery(
      {
        locale,
        slug,
      },
      {
        enabled: Boolean(locale && slug),
        retry: false,
      },
    );

  useEffect(() => {
    if (error) {
      toast.error(error.message || "خطا در دریافت مقاله");
    }
  }, [error]);

  if (isLoading) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl p-10 text-center">
        <p className="font-peyda-regular">در حال بارگذاری مقاله...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl p-10 text-center">
        <p className="font-peyda-regular text-red-600">خطا در دریافت مقاله</p>

        {error?.message && (
          <p className="mt-3 text-sm text-gray-500">{error.message}</p>
        )}
      </main>
    );
  }

  if (!data) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl p-10 text-center">
        <h1 className="mb-3 text-2xl font-bold">مقاله پیدا نشد</h1>

        <p className="text-sm text-gray-500">
          این مقاله وجود ندارد، منتشر نشده است یا برای زبان فعلی ترجمه نشده است.
        </p>

        <p className="mt-3 text-xs text-gray-400" dir="ltr">
          /{locale}/blog/{slug}
        </p>
      </main>
    );
  }

  if (!data.content) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl p-10 text-center">
        <p>اطلاعات اصلی مقاله پیدا نشد.</p>
      </main>
    );
  }

  if (data.content.type !== "BLOG") {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl p-10 text-center">
        <p>این محتوا از نوع بلاگ نیست.</p>
      </main>
    );
  }

  return (
    <main dir="rtl" className="w-full text-right">
      {data.content.coverImage && (
        <section className="px-5 pt-24 md:px-10 md:pt-28">
          <div className="mx-auto max-w-6xl">
            <div className="relative h-[220px] w-full overflow-hidden rounded-3xl md:h-[360px]">
              <Image
                src={data.content.coverImage}
                alt={data.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>
      )}
      <div className="mx-auto px-5 py-20 md:px-20">
        <h1 className="mb-6 font-peyda-bold text-3xl leading-[1.7] md:text-4xl">
          {data.title}
        </h1>

        {data.excerpt && (
          <p className="mb-10 rounded-xl bg-gray-50 p-5 font-peyda-regular text-lg leading-[2] text-gray-600">
            {data.excerpt}
          </p>
        )}

        <ArticleContent html={data.body || "<p></p>"} />
      </div>
    </main>
  );
}
