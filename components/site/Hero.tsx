"use client";

import { getMessages } from "@/messages";
import {
  formatLocaleNumber,
  useCountUp,
} from "@/hooks/useCountUp";

interface HeroProps {
  locale: string;
  /**
   * Number of users to count up to. Defaults to 245 for now; swap in an
   * API value later, e.g. `users={data?.userCount ?? 245}`.
   */
  users?: number;
}

export function Hero({ locale, users = 245 }: HeroProps) {
  const t = getMessages(locale).hero;

  // Count 0 → users, "fast" (~1.2s), starting after the three text reveals
  // finish so the number is the finale.
  const counted = useCountUp(users, 1200, 1600);

  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-2 px-4 py-20 text-center sm:py-28">
      {/* brand */}
      <h1
        className="hero-reveal text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
        style={{ animationDelay: "0.1s" }}
      >
        {t.brand}
      </h1>

      {/* tagline */}
      <p
        className="hero-reveal text-xl font-medium text-primary sm:text-2xl"
        style={{ animationDelay: "0.7s" }}
      >
        {t.tagline}
      </p>

      {/* year */}
      <p
        className="hero-reveal text-lg font-semibold text-muted-foreground"
        style={{ animationDelay: "1.3s" }}
      >
        {t.year}
      </p>

      {/* user count (animated 0 → users) */}
      <p
        className="hero-reveal mt-6 text-3xl font-bold text-foreground sm:text-4xl"
        style={{ animationDelay: "1.6s" }}
      >
        {formatLocaleNumber(counted, locale)}
        <span className="ms-2 text-base font-normal text-muted-foreground">
          {t.usersLabel}
        </span>
      </p>
    </section>
  );
}
