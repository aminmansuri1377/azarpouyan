"use client";

import Image from "next/image";
import { getMessages } from "@/messages";
import { formatLocaleNumber, useCountUp } from "@/hooks/useCountUp";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

interface HeroProps {
  locale: string;
  users?: number;
}

export function Hero({ locale, users = 245 }: HeroProps) {
  const t = getMessages(locale).hero;
  const router = useRouter();

  return (
    <section className="relative isolate flex min-h-[85vh] w-full items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero.jpg"
        alt="Hero background"
        fill
        priority
        className="object-cover object-[75%_center] md:object-center"
      />

      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-slate-900/60" /> */}

      {/* Optional gradient like the Figma */}

      {/* Content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-4 px-6 text-center text-white">
        <h1
          className="hero-reveal md:text-5xl text-2xl font-peyda-bold font-bold tracking-tight mb-5 mt-10"
          style={{ animationDelay: "1s" }}
        >
          {t.tagline}
        </h1>

        <div className="relative w-full max-w-[633px] md:mx-auto text-justify flex flex-col items-center justify-center gap-4 my-5 md:flex-row md:gap-0">
          {/* خط بالای متن - فقط موبایل */}
          <div
            className="h-px w-full max-w-[240px] bg-white/70 md:hidden"
            aria-hidden="true"
          />

          {/* Left horizontal line - فقط دسکتاپ */}
          <div
            className="hidden lg:block absolute right-[calc(100%+74px)] w-[100vw] h-[1px] bg-white"
            aria-hidden="true"
          />

          <p
            className="hero-reveal text-sm font-peyda-regular font-medium text-popover text-center mx-8 md:mx-0"
            style={{ animationDelay: "2s" }}
          >
            {t.description}
          </p>

          {/* Right horizontal line - فقط دسکتاپ */}
          <div
            className="hidden lg:block absolute left-[calc(100%+74px)] w-[100vw] h-[1px] bg-white"
            aria-hidden="true"
          />

          {/* خط پایین متن - فقط موبایل */}
          <div
            className="h-px w-full max-w-[240px] bg-white/70 md:hidden"
            aria-hidden="true"
          />
        </div>

        <div
          className="gap-10 md:flex mt-10"
          style={{ animationDelay: "2.3s" }}
        >
          <Button
            onClick={() => router.push(`/${locale}/contact`)}
            className="px-14"
          >
            {t.receiveConsulting}
          </Button>
          <Button
            className="hidden px-14 mt-4 md:mt-0 md:inline-flex"
            variant="secondary"
          >
            {t.seeServices}
          </Button>
        </div>
      </div>
    </section>
  );
}
