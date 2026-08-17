import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { cn } from "@/lib/cn";

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
    <div className="py-16 md:px-6">
      <div className="mx-auto md:max-w-[1200px]">
        <h2 className="mb-8 font-peyda-bold text-3xl text-foreground">
          فرآیند همکاری با ما :
        </h2>

        <div className="relative overflow-hidden font-peyda-regular md:rounded-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center md:w-[50%] md:rounded-3xl"
            style={{ backgroundImage: "url('/images/workman.jpg')" }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 md:hidden md:rounded-3xl" />

          <div className="relative flex flex-col gap-6 p-6 md:p-12">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="flex items-center justify-between gap-6"
              >
                <div className="hidden shrink-0 font-peyda-bold text-8xl text-white/80 md:block" />

                <GlassCard
                  variant="dark"
                  radius="lg"
                  blur="md"
                  className={cn(
                    "flex w-full items-center gap-4 p-6 text-right shadow-sm md:block md:max-w-[800px] md:rounded-3xl md:p-8",
                    "md:border-0 md:bg-primary-foreground md:shadow-lg md:backdrop-blur-none",
                  )}
                >
                  <div className="min-w-0 flex-1 md:mx-20 md:flex md:items-center">
                    <span className="hidden font-peyda-thin text-7xl text-black md:order-first md:block">
                      {step.number}
                    </span>

                    <span className="shrink-0 font-peyda-thin text-5xl text-white/90 md:hidden">
                      {step.number}
                    </span>

                    <div className="md:mx-20">
                      <h3 className="mb-2 font-peyda-semibold text-lg text-white md:mb-3 md:text-xl md:text-foreground">
                        {step.title}
                      </h3>
                      <p className="font-peyda-regular text-sm leading-[1.8] text-white/85 md:text-base md:text-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
