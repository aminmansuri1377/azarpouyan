import React from "react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "مورد اولی که باید بهش اشاره بشه",
    description:
      "ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و دسترسی به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه می‌دهیم. هدف ما ساده‌تر کردن فرآیند خرید، تأمین و تصمیم‌گیری در تجارت جهانی است.",
  },
  {
    number: "02",
    title: "مورد اولی که باید بهش اشاره بشه",
    description:
      "ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و دسترسی به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه می‌دهیم. هدف ما ساده‌تر کردن فرآیند خرید، تأمین و تصمیم‌گیری در تجارت جهانی است.",
  },
  {
    number: "03",
    title: "مورد اولی که باید بهش اشاره بشه",
    description:
      "ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و دسترسی به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه می‌دهیم. هدف ما ساده‌تر کردن فرآیند خرید، تأمین و تصمیم‌گیری در تجارت جهانی است.",
  },
];

function HowItWorks() {
  return (
    <section dir="rtl" className="px-6 py-16">
      <div className="mx-auto md:max-w-[1200px]">
        <h2 className="mb-8 font-peyda-bold text-3xl text-foreground">
          نحوه کار:
        </h2>

        <div className="relative overflow-hidden rounded-3xl font-peyda-regular">
          <div
            className="absolute inset-0 md:w-[50%] rounded-3xl"
            style={{ backgroundImage: "url('/images/workman.jpg')" }}
          />

          <div className="relative flex flex-col gap-6 p-6 md:p-12">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="flex items-center justify-between gap-6"
              >
                <div className="hidden shrink-0 font-peyda-bold text-8xl text-white/80 md:block"></div>
                <div className="w-full rounded-3xl bg-primary-foreground p-8 text-right shadow-sm md:max-w-[800px]">
                  <div className="md:flex md:items-center">
                    <span className=" font-peyda-thin text-7xl text-black ">
                      {step.number}
                    </span>
                    <div className="md:mx-20">
                      <h3 className="mb-3 font-peyda-semibold text-xl text-foreground">
                        {step.title}
                      </h3>
                      <p className="font-peyda-regular text-base leading-[1.8] text-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
