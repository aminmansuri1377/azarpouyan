"use client";

import React from "react";
import { formatLocaleNumber, useCountUp } from "@/hooks/useCountUp";
import { useParams } from "next/navigation";
import { getMessages } from "@/messages";
import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui";

const VALUES = [
  {
    title: "مورد اول",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
  {
    title: "مورد دوم",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
  {
    title: "مورد سوم",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
];

const STATS = [
  {
    value: 100,
    label: "معامله جاری",
  },
  {
    value: 200,
    label: "معامله به اتمام رسیده",
  },
  {
    value: 20,
    label: "سال تجربه",
  },
];

function StatItem({
  stat,
  locale = "fa",
  enabled,
}: {
  stat: {
    value: number;
    label: string;
  };
  locale?: string;
  enabled: boolean;
}) {
  const count = useCountUp(stat.value, 2400, 200, enabled);

  return (
    <div className="text-center">
      <div className="font-peyda-bold text-4xl leading-none text-foreground sm:text-5xl lg:text-6xl">
        {formatLocaleNumber(count, locale)}+
      </div>

      <div className="mt-2 whitespace-nowrap font-peyda-medium text-xs text-foreground sm:text-sm lg:mt-3 lg:text-lg">
        {stat.label}
      </div>
    </div>
  );
}

function AboutUs() {
  const params = useParams();

  const locale = params.locale as string;
  const t = getMessages(locale);

  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>({
    threshold: 0.4,
  });

  return (
    <main dir="rtl" className="overflow-hidden bg-background text-foreground">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative isolate">
        {/* Hero background */}
        <div
          className="
            absolute inset-x-0 top-0 -z-10
            h-72
            bg-cover bg-center
            md:h-full
          "
          style={{
            backgroundImage: "url('/images/towman.jpg')",
          }}
        />

        {/* Hero overlay */}
        {/* <div
          className="
            absolute inset-x-0 top-0 -z-10
            h-72
            bg-slate-950/60
            md:inset-0
            md:h-full
          "
        /> */}

        {/* Hero content */}
        <div className="container mx-auto px-4 pb-8 pt-24 text-center sm:px-6 md:pb-16 md:pt-32 lg:px-8">
          <h1 className="font-peyda-bold text-2xl leading-relaxed text-white sm:text-3xl md:text-4xl">
            درباره ما :
          </h1>

          <p className="mx-auto mt-4 max-w-xl font-peyda-regular text-xs leading-loose text-white sm:text-sm md:text-base lg:text-lg">
            {t.hero.description}
          </p>
        </div>

        {/* =======================================================
            COMPANY STORY
        ======================================================= */}

        <div className="container mx-auto px-4 pb-10 sm:px-6 md:pb-24 lg:px-8">
          <div
            className="
              mx-auto max-w-6xl
              mt-20
              md:rounded-3xl
              md:bg-white/15
              md:p-10
              md:backdrop-blur-md
              lg:p-14
          "
          >
            <h2 className="mb-5 text-center font-peyda-bold text-xl text-foreground md:mb-6 md:text-3xl md:text-white">
              داستان شرکت :
            </h2>

            <p className="text-justify font-peyda-regular text-xs leading-loose text-foreground md:text-base md:leading-9 md:text-white lg:text-lg">
              {t.hero.description}
              {t.hero.description}
              {t.hero.description}
              {t.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          MISSION & VISION
      ========================================================= */}

      <section className="container mx-auto px-4 pt-10 sm:px-6 md:pt-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
            <div
              className="
                aspect-[4/3]
                bg-cover
                bg-center
                sm:aspect-video
                md:h-[60vh]
                w-full
              "
              style={{
                backgroundImage: "url('/images/select.jpg')",
              }}
            />

            {/* <div className="absolute inset-0 bg-slate-950/60" /> */}

            <div className="absolute inset-0 flex items-center justify-center px-6 pb-16 text-center md:items-start md:pt-16">
              <h2 className="font-peyda-bold text-xl leading-relaxed text-white md:text-3xl">
                ماموریت و چشم انداز ما :
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 md:mx-auto mx-4 -mt-20 max-w-3xl rounded-2xl bg-white p-6 shadow-lg sm:p-8 md:-mt-64 md:rounded-3xl md:p-12">
            <p className="text-justify font-peyda-regular text-xs leading-loose text-foreground sm:text-sm md:text-base md:leading-8 lg:text-lg">
              {t.hero.description}
              {t.hero.description}
              {t.hero.description}
              {t.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          ORGANIZATIONAL VALUES
      ========================================================= */}

      <section className="container mx-auto px-4 pt-12 text-center sm:px-6 md:pt-24 lg:px-8">
        <h2 className="font-peyda-bold text-xl text-foreground md:text-3xl">
          ارزش های سازمانی
        </h2>

        <div className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-3 sm:gap-5 md:mt-12 md:gap-6">
          {VALUES.map((value) => (
            <article
              key={value.title}
              className="
                rounded-2xl
                border
                border-primary/70
                p-5
                text-right
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-md

                sm:p-6
                md:rounded-3xl
                md:p-8
                md:text-center
              "
            >
              <h3 className="mb-2 font-peyda-semibold text-sm text-foreground md:mb-4 md:text-xl lg:text-2xl">
                {value.title}
              </h3>

              <p className="font-peyda-regular text-xs leading-loose text-foreground md:text-sm">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}

      <section className="container mx-auto px-4 pt-12 text-center sm:px-6 md:pt-24 lg:px-8">
        <h2 className="font-peyda-bold text-xl text-foreground md:text-3xl">
          آمار ها و دست آورد ها :
        </h2>

        <p className="mx-auto mt-4 max-w-3xl font-peyda-regular text-xs leading-loose text-foreground sm:text-sm md:text-base lg:text-lg">
          {t.hero.description}
        </p>

        {/* Counter */}
        <div
          ref={statsRef}
          className="
            mx-auto
            mt-10
            flex
            max-w-sm
            items-start
            justify-between
            gap-4

            md:mt-14
            md:max-w-3xl
            md:justify-center
            md:gap-20
          "
        >
          {STATS.map((stat) => (
            <StatItem
              key={stat.label}
              stat={stat}
              locale="fa"
              enabled={statsInView}
            />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-background to-primary/10 px-4 pb-12 pt-12 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-primary/70 bg-background p-6 text-center shadow-sm sm:p-8 md:rounded-3xl md:p-12">
          <h2 className="font-peyda-bold text-xl text-foreground md:text-3xl">
            منتظر همکاری با شما هستیم
          </h2>

          <p className="mx-auto mt-4 max-w-xl font-peyda-regular text-xs leading-loose text-foreground sm:text-sm md:text-base lg:text-lg">
            {t.hero.description}
          </p>

          <Button className="mt-6 px-8 font-peyda-bold md:mt-8 md:px-10">
            {t.startBusiness}
          </Button>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;
