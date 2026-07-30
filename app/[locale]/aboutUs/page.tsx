"use client";
import React from "react";
import { formatLocaleNumber, useCountUp } from "@/hooks/useCountUp";
import { useParams } from "next/navigation";
import { getMessages } from "@/messages";
import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui";

const VALUES = [
  {
    title: "ارزش شماره 1",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
  {
    title: "ارزش شماره 2",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
  {
    title: "ارزش شماره 3",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
];

const STATS = [
  { value: 100, label: "معامله جاری" },
  { value: 200, label: "معامله به اتمام رسیده" },
  { value: 20, label: "سال تجربه" },
];
function StatItem({
  stat,
  locale = "fa",
  enabled,
}: {
  stat: { value: number; label: string };
  locale?: string;
  enabled: boolean;
}) {
  const count = useCountUp(stat.value, 2400, 200, enabled);
  return (
    <div>
      <div className="font-peyda-bold text-6xl text-foreground">
        {formatLocaleNumber(count, locale)}+
      </div>
      <div className="mt-3 font-peyda-medium text-xl text-foreground">
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
    <div dir="rtl" className="bg-white">
      {/* ---------------------------------------------------------------- */}
      {/* Hero + company story (both share the towman.jpg background)      */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/towman.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-[rgba(15,28,45,0.6)]" />

        <div className="mx-auto max-w-[1100px] px-6 pt-36 pb-20 text-center">
          <h1 className="font-peyda-bold text-4xl leading-[1.5] text-white">
            درباره ما :
          </h1>
          <p className="mx-auto mt-4 max-w-[633px] font-peyda-regular text-lg leading-[1.8] text-white">
            {t.hero.description}
          </p>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 pb-28">
          <div className="rounded-[40px] bg-[rgba(245,245,247,0.2)] p-10 backdrop-blur-sm md:p-14">
            <h2 className="mb-6 text-center font-peyda-bold text-3xl text-white">
              داستان شرکت :
            </h2>
            <p className="text-justify font-peyda-regular text-lg leading-[1.8] text-white">
              {t.hero.description}
              {t.hero.description}
              {t.hero.description}
              {t.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Mission & vision (select.jpg background + overlapping light card) */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative px-6 pt-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="relative overflow-hidden rounded-[40px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/select.jpg')" }}
            />
            <div className="absolute inset-0 bg-[rgba(15,28,45,0.6)]" />
            <div className="relative px-10 pt-16 pb-40 text-center">
              <h2 className="font-peyda-bold text-3xl text-white">
                ماموریت و چشم انداز ما :
              </h2>
            </div>
          </div>

          <div className="relative z-10 mx-auto -mt-28 max-w-[800px] rounded-[40px] bg-[#F5F5F7] px-10 py-10 shadow-lg md:px-14 md:py-12">
            <p className="text-justify font-peyda-regular text-lg leading-[1.6] text-foreground">
              {t.hero.description}
              {t.hero.description}
              {t.hero.description}
              {t.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Organizational values                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 pt-24 text-center">
        <h2 className="font-peyda-bold text-3xl text-[#3F3F3F]">
          ارزش های سازمانی
        </h2>

        <div className="mx-auto mt-12 grid max-w-[1000px] gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-3xl border-2 border-primary px-8 py-10"
            >
              <h3 className="mb-4 font-peyda-semibold text-2xl text-foreground">
                {value.title}
              </h3>
              <p className="font-peyda-regular text-sm leading-[2] text-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stats / achievements                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 pt-24 text-center">
        <h2 className="font-peyda-bold text-3xl text-foreground">
          آمار ها و دست آورد ها :
        </h2>
        <p className="mx-auto mt-4 max-w-[813px] font-peyda-regular text-lg leading-[1.6] text-foreground">
          {t.hero.description}
        </p>

        <div
          ref={statsRef}
          className="mt-12 flex flex-wrap justify-center gap-x-20 gap-y-10"
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

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-gradient-to-b from-white to-[#e9dfc7] px-6 py-24">
        <div className="mx-auto max-w-[900px] rounded-3xl border-2 border-primary p-12 text-center shadow-sm">
          <h2 className="font-peyda-bold text-3xl text-foreground">
            منتظر همکاری با شما هستیم
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] font-peyda-regular text-lg leading-[1.7] text-foreground mb-10">
            {t.hero.description}
          </p>
          <Button className=" px-10 font-peyda-bold">{t.startBusiness}</Button>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
