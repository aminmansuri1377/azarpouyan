// components/site/about/JournalSection.tsx
"use client";
import { trpc } from "@/lib/trpc/client";

import DotPattern from "../DotPattern";
import SectionBorderTitle from "../SectionBorderTitle";
import JournalCard from "./JournalCard";

export default function JournalSection() {
  const {
    data: journals,
    isPending,
    isError,
    refetch,
  } = trpc.journal.getPublished.useQuery();
  return (
    <section className="relative overflow-hidden bg-neutral-900 px-4 py-14 md:px-12 md:py-20 lg:px-20">
      <DotPattern />

      <div className="relative z-10 mx-auto max-w-7xl" dir="rtl">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionBorderTitle className="text-white">
              آخرین گاهنامه آذر پویان
            </SectionBorderTitle>
          </div>

          <p className="mx-auto mt-2 max-w-3xl font-peyda-regular text-xs leading-loose text-white/60 md:text-sm lg:text-base">
            گاهنامه آذرپویان، روایت پروژه‌ها، ایده‌ها و مسیر توسعه‌ای است که پشت
            هر پروژه شکل می‌گیرد.در هر شماره، نگاهی دقیق‌تر به معماری، کیفیت،
            تجربه زندگی و فرصت‌های پیش‌روی آذرپویان خواهیم داشت.{" "}
          </p>
          {isPending && (
            <p className="mt-10 text-white/70" role="status">
              در حال دریافت گاهنامه‌ها…
            </p>
          )}
          {isError && (
            <p className="mt-10 text-white/70" role="alert">
              دریافت گاهنامه‌ها انجام نشد.{" "}
              <button
                type="button"
                className="underline"
                onClick={() => refetch()}
              >
                تلاش دوباره
              </button>
            </p>
          )}
          {journals?.length === 0 && (
            <p className="mt-10 text-white/70">
              گاهنامه‌ای هنوز منتشر نشده است.
            </p>
          )}
          {journals?.map((journal) => (
            <div
              key={journal.id}
              className="mt-10 rounded-2xl bg-white/5 p-6 md:mt-14 md:rounded-3xl md:p-12"
            >
              <JournalCard
                image={journal.image}
                heading={journal.title}
                title={journal.title}
                description={journal.description}
                journalId={journal.id}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
