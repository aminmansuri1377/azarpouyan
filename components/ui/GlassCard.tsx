// src/components/ui/GlassCard.tsx
import React from "react";
import { cn } from "@/lib/cn";

type GlassCardVariant = "light" | "dark";
type GlassCardRadius = "sm" | "md" | "lg" | "xl" | "full";

const radiusMap: Record<GlassCardRadius, string> = {
  sm: "rounded-xl",
  md: "rounded-2xl",
  lg: "rounded-3xl",
  xl: "rounded-[40px]", // مطابق مقدار فیگما: 40px
  full: "rounded-full",
};

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassCardVariant;
  radius?: GlassCardRadius;
  /** میزان بلور پس‌زمینه */
  blur?: "sm" | "md" | "lg";
  /** نمایش افکت رفلکشن ظریف در گوشه‌ی بالا (اختیاری) */
  withReflection?: boolean;
  children?: React.ReactNode;
}

const blurMap = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
};

export function GlassCard({
  variant = "light",
  radius = "xl",
  blur = "sm",
  withReflection = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border",
        radiusMap[radius],
        blurMap[blur],
        // حالت روشن: دقیقاً مطابق مقدار فیگما rgba(217,217,217,0.2)
        variant === "light" && "border-white/25 bg-[rgba(217,217,217,0.2)]",
        // حالت تیره: برای روی عکس/بک‌گراند تیره (مثل HowItWorks موبایل)
        variant === "dark" && "border-white/10 bg-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.15)]",
        className,
      )}
      {...props}
    >
      {withReflection && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/25 via-white/5 to-transparent"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
