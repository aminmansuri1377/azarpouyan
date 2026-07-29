"use client";
import React from "react";
import { formatLocaleNumber, useCountUp } from "@/hooks/useCountUp";

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
}: {
  stat: { value: number; label: string };
  locale?: string;
}) {
  const count = useCountUp(stat.value, 2400, 200);
  return (
    <div>
      <div className="font-peyda-bold text-6xl text-[#35281F]">
        {formatLocaleNumber(count, locale)}+
      </div>
      <div className="mt-3 font-peyda-medium text-xl text-[#35281F]">
        {stat.label}
      </div>
    </div>
  );
}
function AboutUs() {
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
            ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و دسترسی
            به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه می‌دهیم. هدف ما
            ساده‌تر کردن فرآیند خرید، تأمین و تصمیم‌گیری در تجارت جهانی است.
          </p>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 pb-28">
          <div className="rounded-[40px] bg-[rgba(245,245,247,0.2)] p-10 backdrop-blur-sm md:p-14">
            <h2 className="mb-6 text-center font-peyda-bold text-3xl text-white">
              داستان شرکت :
            </h2>
            <p className="text-justify font-peyda-regular text-lg leading-[1.8] text-white">
              ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و
              دسترسی به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه
              می‌دهیم. هدف ما سالورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از
              صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه
              روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی
              تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای
              کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده،
              شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت
              بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ
              پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که
              تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان
              رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی
              سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
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
            <p className="text-justify font-peyda-regular text-lg leading-[1.6] text-[#35281F]">
              ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و
              دسترسی به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه
              می‌دهیم. هدف ما سالورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از
              صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه
              روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی
              تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای
              کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده،
              شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت
              بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ
              پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که
              تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان
              رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی
              سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
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
              className="rounded-[32px] border border-[#E0B247] px-8 py-10"
            >
              <h3 className="mb-4 font-peyda-semibold text-2xl text-[#35281F]">
                {value.title}
              </h3>
              <p className="font-peyda-regular text-sm leading-[2] text-[#35281F]">
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
        <h2 className="font-peyda-bold text-3xl text-[#35281F]">
          آمار ها و دست آورد ها :
        </h2>
        <p className="mx-auto mt-4 max-w-[813px] font-peyda-regular text-lg leading-[1.6] text-[#35281F]">
          ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و دسترسی
          به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه می‌دهیم. هدف ما
          ساده‌تر کردن فرآیند خرید، تأمین و تصمیم‌گیری در تجارت جهانی است.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-x-20 gap-y-10">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} locale="fa" />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-gradient-to-b from-white to-[#e9dfc7] px-6 py-24">
        <div className="mx-auto max-w-[900px] rounded-[32px] bg-white/70 p-12 text-center shadow-sm">
          <h2 className="font-peyda-bold text-3xl text-[#35281F]">
            منتظر همکاری با شما هستیم
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] font-peyda-regular text-lg leading-[1.7] text-[#35281F]">
            ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و دسترسی
            به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه می‌دهیم. هدف ما
            ساده‌تر کردن فرآیند خرید، تأمین و تصمیم‌گیری در تجارت جهانی است.
          </p>
          <button
            type="button"
            className="mt-8 rounded-2xl bg-[#D7A53A] px-14 py-3 font-peyda-medium text-lg text-white hover:bg-[#c4952f]"
          >
            شروع همکاری
          </button>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
