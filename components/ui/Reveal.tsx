"use client";

import { type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useInView } from "@/hooks/useInView";

type RevealDirection = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** جهت ورود المان (پیش‌فرض: از پایین به بالا) */
  direction?: RevealDirection;
  /** تأخیر شروع انیمیشن به میلی‌ثانیه — برای ورود پلکانی (stagger) */
  delay?: number;
  /** آستانه‌ی دید: چه نسبتی از المان باید دیده شود تا انیمیشن اجرا شود (0 تا 1) */
  threshold?: number;
  style?: CSSProperties;
}

/**
 * Reveal — ورود نرم المان‌ها هنگام اسکرول.
 *
 * - فقط روی opacity/transform کار می‌کند (GPU) و هیچ کتابخانه‌ی خارجی ندارد.
 * - یک‌بار اجرا می‌شود (triggerOnce) و بعد از دیده‌شدن المان را آزاد می‌کند.
 * - با prefers-reduced-motion به‌صورت خودکار غیرفعال می‌شود (سراسری در globals.css).
 *
 * @example
 * <Reveal delay={150} direction="up">
 *   <h2>...</h2>
 * </Reveal>
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  threshold = 0.15,
  style,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      data-direction={direction}
      className={cn("reveal", inView && "is-visible", className)}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
