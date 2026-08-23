"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import { trpc } from "@/lib/trpc/client";
import { ArticleContent } from "@/components/content/ArticleContent";

export default function ProjectSinglePage() {
  const params = useParams<{
    locale: string;
    slug: string;
  }>();

  const locale = params.locale;
  const slug = params.slug;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, isLoading, isError, error } =
    trpc.public.getProjectBySlug.useQuery(
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
      toast.error(error.message || "خطا در دریافت اطلاعات پروژه");
    }
  }, [error]);

  if (isLoading) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl p-20 text-center font-peyda-regular">
        <p className="text-lg text-muted-foreground">در حال بارگذاری اطلاعات پروژه...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl p-20 text-center font-peyda-regular">
        <h1 className="text-2xl font-bold text-destructive mb-2">خطا در دریافت پروژه</h1>
        <p className="text-muted-foreground">{error?.message}</p>
      </main>
    );
  }

  if (!data || !data.project) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl p-20 text-center font-peyda-regular">
        <h1 className="mb-3 text-3xl font-peyda-bold">پروژه پیدا نشد</h1>
        <p className="text-sm text-muted-foreground">
          این پروژه وجود ندارد، منتشر نشده است یا برای زبان فعلی ترجمه نشده است.
        </p>
        <p className="mt-3 text-xs text-muted-foreground/60" dir="ltr">
          /{locale}/workExamples/{slug}
        </p>
      </main>
    );
  }

  const { project, name, summary, specifications, description } = data;
  const galleryImages = Array.isArray(project.images) ? (project.images as string[]) : [];

  // Parse specifications into bullet items
  const specItems = specifications
    ? specifications
        .split("\n")
        .map((line) => line.trim().replace(/^[•\-\*]\s*/, ""))
        .filter((line) => line.length > 0)
    : [];

  return (
    <main dir="rtl" className="w-full text-right font-peyda-regular pb-24">
      {/* ========================================================================= */}
      {/* 1. Hero Cover Image with Floating Card Overlay                            */}
      {/* ========================================================================= */}
      <div className="relative w-full pt-16 md:pt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Main Cover Image */}
          <div className="relative h-[300px] sm:h-[420px] md:h-[540px] w-full overflow-hidden rounded-xl shadow-lg">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={name || "تصویر پروژه"}
                fill
                priority
                className="object-cover object-center"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                تصویر در دسترس نیست
              </div>
            )}
          </div>

          {/* Overlapping White Box Below Hero (Centered) */}
          <div className="relative -mt-10 sm:-mt-16 md:-mt-20 z-20 mx-auto max-w-3xl px-4">
            <div className="rounded-xl bg-white dark:bg-card p-6 sm:p-8 md:p-10 text-center shadow-xl border border-border/50">
              <h1 className="font-peyda-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-3 sm:mb-4">
                {name}
              </h1>
              {summary && (
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  {summary}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Content Container                                                         */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-14">
        {/* ======================================================================= */}
        {/* 2. Summary Section (خلاصه ای درباره پروژه)                             */}
        {/* ======================================================================= */}
        {summary && (
          <section className="space-y-4">
            <h2 className="font-peyda-bold text-xl sm:text-2xl text-foreground">
              خلاصه ای درباره پروژه
            </h2>
            <p className="text-justify text-sm sm:text-base text-muted-foreground leading-loose">
              {summary}
            </p>
          </section>
        )}

        {/* ======================================================================= */}
        {/* 3. Specifications Section (مشخصات کلیدی پروژه)                           */}
        {/* ======================================================================= */}
        {specItems.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-peyda-bold text-xl sm:text-2xl text-foreground">
              مشخصات کلیدی پروژه
            </h2>
            <ul className="space-y-2.5 text-sm sm:text-base text-muted-foreground pr-2">
              {specItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ======================================================================= */}
        {/* 4. TipTap Rich Text Description                                          */}
        {/* ======================================================================= */}
        {description && (
          <section className="space-y-6">
            <ArticleContent html={description} />
          </section>
        )}

        {/* ======================================================================= */}
        {/* 5. Gallery Section (گالری تصاویر:)                                       */}
        {/* ======================================================================= */}
        {galleryImages.length > 0 && (
          <section className="space-y-6 pt-4">
            <h2 className="font-peyda-bold text-xl sm:text-2xl text-foreground">
              گالری تصاویر:
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {galleryImages.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <Image
                    src={imgUrl}
                    alt={`${name} - تصویر گالری ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white bg-black/60 rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                        <path d="M11 8v6M8 11h6" />
                      </svg>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Lightbox / Modal for Gallery Preview                                      */}
      {/* ========================================================================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="بستن"
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="relative h-[60vh] sm:h-[75vh] w-[85vw] max-w-4xl">
              <Image
                src={selectedImage}
                alt="نمایش تصویر"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
