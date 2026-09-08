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
      className="relative isolate w-full overflow-hidden bg-[#f8f5ed] text-[#0f172a] lg:flex lg:aspect-video lg:items-center"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-8 sm:px-10 lg:px-20 lg:pt-24 lg:pb-12">
        <div className="flex flex-col items-start gap-6 text-start lg:ml-auto lg:w-1/2">
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

      {/* The source artwork occupies the left half of a wide video.
          On mobile, crop its empty right half below the text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative aspect-square w-full overflow-hidden select-none lg:absolute lg:inset-0 lg:aspect-auto"
      >
        {/* Native non-looping playback retains the final frame. Keep this
            element mounted; no ended handler, seek, or source reset is needed. */}
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
          className="absolute top-0 left-0 h-full w-[200%] max-w-none object-cover lg:w-full"
        >
          <source src="/images/herogif.webm" type="video/webm" />
        </video>
      </div>
    </section>
  );
}
