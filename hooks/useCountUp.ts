"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animate an integer from 0 → `end` using requestAnimationFrame.
 * No external deps. Honors prefers-reduced-motion (snaps to `end`).
 *
 * @param end      Target number (e.g. 245).
 * @param duration Total animation time in ms. Default 1200ms ("fast").
 * @param start    Delay before the count begins, in ms. Default 0.
 *
 * @example
 * const users = useCountUp(245, 1200);
 * // later, from an API:
 * const { data } = useQuery(...);
 * const users = useCountUp(data?.users ?? 0);
 */
export function useCountUp(end: number, duration = 1200, start = 0): number {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  // No target (0 / undefined / NaN) — nothing to animate, stay at 0 without
  // a synchronous setState inside the effect (avoids cascading renders).
  const target = end > 0 ? end : 0;

  useEffect(() => {
    if (target <= 0) return;

    // Respect users who prefer reduced motion: jump straight to the end.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // One-time set: skip the animation for reduced-motion users.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(target);
      return;
    }

    let startTime: number | null = null;
    let startTimer: ReturnType<typeof setTimeout> | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic — fast start, gentle settle on the final number.
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    startTimer = setTimeout(() => {
      frame.current = requestAnimationFrame(tick);
    }, start);

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration, start]);

  return value;
}

/**
 * Format an integer for the current locale (Persian digits for `fa`, etc.).
 *
 * @example formatLocaleNumber(245, "fa") // "۲۴۵"
 */
export function formatLocaleNumber(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}
