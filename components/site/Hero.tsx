import Link from "next/link";

import { getMessages } from "@/messages";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  locale: string;
}

export function Hero({ locale }: HeroProps) {
  const t = getMessages(locale).hero;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-screen min-h-[100svh] w-full items-center overflow-hidden "
    >
      <video
        autoPlay
        muted
        playsInline
        controls={false}
        loop={false}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        preload="auto"
        poster="/images/hero-poster.jpg"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-center select-none"
      >
        <source src="/images/herogif.webm" type="video/webm" />
      </video>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-l from-[#f1eeea]/20 via-[#f1eeea]/10 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 pb-12 sm:px-10 lg:px-20 ">
        <div className="flex max-w-xl flex-col text-center items-start gap-6 md:text-start lg:ml-auto lg:w-[46%] bg-white/70  p-5 rounded-2xl">
          <h1
            id="hero-heading"
            className="whitespace-pre-line font-peyda-bold text-3xl leading-relaxed font-bold sm:text-4xl lg:text-[clamp(1.5rem,2.6vw,2.75rem)]"
          >
            {t.tagline}
          </h1>

          <p className="font-peyda-regular text-base leading-8 lg:text-lg">
            {t.description}
          </p>

          <Button
            asChild
            className="mt-2 min-w-48 rounded-full bg-[#c8a24a] px-10 text-white hover:bg-[#b58f38] md:rounded-full"
          >
            <Link href={`/${locale}/contact`}>{t.receiveConsulting}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
