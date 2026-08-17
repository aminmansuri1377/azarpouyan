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
      <SectionTitle sticky={sticky} className={""}>
        {title}
      </SectionTitle>
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default StickySection;
