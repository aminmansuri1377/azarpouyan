// components/SectionBorderTitle.tsx
import React from "react";

interface SectionBorderTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionBorderTitle({
  children,
  className = "",
}: SectionBorderTitleProps) {
  return (
    <div className={`relative inline-block ${className}`} dir="rtl">
      {/* SVG Border - ترکیب Vector 4 و Vector 5 */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Vector 4 - سمت چپ (شکل <) */}
        <path
          d="M179.601 0.5H19.6547L0.60144 29.2478L19.6547 57.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Vector 5 - سمت راست (شکل >) */}
        <path
          d="M220 57.2795H379.947L399 28.5317L379.947 0.279542"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* خط بالایی بین دو Vector */}
        {/* <line
          x1="179.601"
          y1="0.5"
          x2="379.947"
          y2="0.279542"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        /> */}

        {/* خط پایینی بین دو Vector */}
        {/* <line
          x1="19.6547"
          y1="57.5"
          x2="220"
          y2="57.2795"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        /> */}
      </svg>

      {/* Content */}
      <div className="relative px-24 py-4 text-center font-bold text-2xl font-peyda-bold">
        {children}
      </div>
    </div>
  );
}
