"use client";

import Image from "next/image";
import { formatLocaleNumber, useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";

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
    <div className="flex-1 text-center">
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
      <div
        ref={ref}
        className="mx-auto flex max-w-5xl items-center justify-between"
      >
        {STATS.map((stat, index) => (
          <div key={stat.label} className="flex items-center flex-1">
            <StatItemView stat={stat} locale={locale} enabled={inView} />
            {index < STATS.length - 1 && (
              <Image
                src="/images/divide.svg"
                alt=""
                width={2}
                height={60}
                className="h-16 w-auto"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
