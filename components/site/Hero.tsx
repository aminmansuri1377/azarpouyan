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
  const counted = useCountUp(users, 1200, 1600);
  const router = useRouter();

  return (
    <section className="relative isolate flex min-h-[85vh] w-full items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero.jpg"
        alt="Hero background"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-900/60" />

      {/* Optional gradient like the Figma */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/40 to-slate-900/70" />

      {/* Content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-4 px-6 text-center text-white">
        <h1
          className="hero-reveal text-4xl font-peyda-bold font-bold tracking-tight sm:text-6xl mb-5 mt-10"
          style={{ animationDelay: "1s" }}
        >
          {t.tagline}
        </h1>

        <p
          className="hero-reveal text-xl font-peyda-regular font-medium text-popover sm:text-2xl my-5"
          style={{ animationDelay: "2s" }}
        >
          {t.description}
        </p>

        {/* <p
          className="hero-reveal text-lg text-slate-200"
          style={{ animationDelay: "1.9s" }}
        >
          {t.year}
        </p> */}
        <div className="gap-10 flex" style={{ animationDelay: "2.3s" }}>
          <Button
            onClick={() => router.push(`/${locale}/contact`)}
            className="px-14"
          >
            {t.receiveConsulting}
          </Button>
          <Button className="px-14" variant="secondary">
            {t.seeServices}
          </Button>
        </div>
        {/* <p
          className="hero-reveal mt-6 text-3xl font-bold sm:text-4xl"
          style={{ animationDelay: "2.5s" }}
        >
          {formatLocaleNumber(counted, locale)}
          <span className="ms-2 text-base font-normal text-slate-300">
            {t.usersLabel}
          </span>
        </p> */}
      </div>
    </section>
  );
}
