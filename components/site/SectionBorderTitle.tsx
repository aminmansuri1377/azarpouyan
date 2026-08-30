"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/hooks/useInView";

interface SectionBorderTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * تیتر قاب‌دار — خطوط کناری موقع اسکرول با انیمیشن draw کشیده می‌شوند
 * و متن به‌آرامی بالا می‌آید.
 */
export default function SectionBorderTitle({
  children,
  className = "",
}: SectionBorderTitleProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className={cn("relative inline-block", className)}
      dir="rtl"
    >
      {/* SVG Border - ترکیب Vector 4 و Vector 5 */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Vector 4 - سمت چپ (شکل <) */}
        <path
          className={cn("sbt-draw", inView && "is-in")}
          style={{ transitionDelay: "0.1s" }}
          d="M179.601 0.5H19.6547L0.60144 29.2478L19.6547 57.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Vector 5 - سمت راست (شکل >) */}
        <path
          className={cn("sbt-draw", inView && "is-in")}
          style={{ transitionDelay: "0.3s" }}
          d="M220 57.2795H379.947L399 28.5317L379.947 0.279542"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Content */}
      <div
        className={cn(
          "sbt-text relative px-5 md:px-24 py-4 text-center font-bold text-2xl font-peyda-bold",
          inView && "is-in",
        )}
      >
        {children}
      </div>
    </div>
  );
}
