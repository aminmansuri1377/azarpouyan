import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "outline";

export type BadgeSize = "sm" | "md" | "lg";

const VARIANT: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary/10 text-primary",
  primary: "border-transparent bg-primary text-primary-foreground",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground",
  success: "border-transparent bg-success/15 text-success",
  warning: "border-transparent bg-warning/15 text-warning",
  destructive: "border-transparent bg-destructive/15 text-destructive",
  info: "border-transparent bg-info/15 text-info",
  outline: "border-border text-foreground",
};

const SIZE: Record<BadgeSize, string> = {
  sm: "h-5 px-2 text-xs gap-1",
  md: "h-6 px-2.5 text-xs gap-1",
  lg: "h-7 px-3 text-sm gap-1.5",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

/** Compact pill for labels, statuses, counts, and removable tags. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant = "default", size = "md", children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium leading-none whitespace-nowrap",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
});
