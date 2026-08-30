"use client";

import Image from "next/image";
import { formatLocaleNumber, useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { Reveal } from "../../ui/Reveal";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 23, suffix: "+", label: "پروژه انجام شده" },
  { value: 83, suffix: "%", label: "رضایت مشتری" },
  { value: 400, suffix: "+", label: "واحد مسکونی" },
  { value: 400, suffix: "+", label: "واحد تجاری" },
];

function StatItemView({
  stat,
  locale = "fa",
  enabled,
}: {
  stat: StatItem;
  locale?: string;
  enabled: boolean;
}) {
  const count = useCountUp(stat.value, 1600, 150, enabled);

  return (
    // flex-1 حذف شد چون در grid نیازی به آن نیست و text-center کافیست
    <div className="text-center">
      <div className="font-peyda-bold text-3xl leading-none text-foreground sm:text-4xl lg:text-5xl">
        {formatLocaleNumber(count, locale)}
        {stat.suffix}
      </div>

      <div className="mt-2 whitespace-nowrap font-peyda-medium text-xs text-foreground/70 sm:text-sm">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsSection({ locale = "fa" }: { locale?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });

  return (
    <section className="px-4 py-10 md:px-12 md:py-14 lg:px-20" dir="rtl">
      {/* تغییرات اصلی: استفاده از grid، ۲ ستون در موبایل و ۴ ستون در دسکتاپ */}
      <div
        ref={ref}
        className="mx-auto grid max-w-5xl grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0"
      >
        {STATS.map((stat, index) => (
          <Reveal
            key={stat.label}
            delay={index * 120}
            // اضافه کردن relative برای پوزیشن دهی به divider
            className="relative flex items-center justify-center"
          >
            <StatItemView stat={stat} locale={locale} enabled={inView} />

            {/* Divider با پوزیشن absolute تا دقیقاً روی مرز سلول‌ها بنشیند */}
            {index < STATS.length - 1 && (
              <Image
                src="/images/divide.svg"
                alt=""
                width={2}
                height={60}
                className="absolute left-0 top-1/2 h-16 w-auto -translate-y-1/2"
              />
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
