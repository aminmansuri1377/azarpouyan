"use client";

import { cn } from "@/lib/cn";
import React from "react";
import SectionTitle from "./SectionTitle";

interface StickySectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
  id?: string;
  dir?: "rtl" | "ltr";
}

/**
 * هر بخش صفحه را داخل این کامپوننت بگذار.
 * راز افکت: هر <section> یک «کانتینر چسبندگی» است؛
 * تیتر داخل آن فقط تا انتهای همان section می‌چسبد و
 * وقتی section بعدی بالا می‌آید، تیتر قبلی را به بیرون هل می‌دهد
 * و تیتر جدید جایش می‌نشیند. صد در صد CSS، بدون جاوااسکریپت.
 */
export function StickySection({
  title,
  children,
  className,
  sticky = true,
  id,
  dir,
}: StickySectionProps) {
  return (
    <section id={id} dir={dir} className={cn("relative", className)}>
      <SectionTitle sticky={sticky}>{title}</SectionTitle>
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default StickySection;
