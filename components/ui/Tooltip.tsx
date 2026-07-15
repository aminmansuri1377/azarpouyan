"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  /** Preferred placement. */
  side?: "top" | "bottom" | "start" | "end";
  className?: string;
}

const SIDE: Record<NonNullable<TooltipProps["side"]>, string> = {
  top: "bottom-full mb-1.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2",
  bottom: "top-full mt-1.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2",
  start: "end-full me-1.5 top-1/2 -translate-y-1/2",
  end: "start-full ms-1.5 top-1/2 -translate-y-1/2",
};

/**
 * CSS-only-ish tooltip: shows on hover/focus of its child. No portal needed for
 * most cases; keep tooltips short. Pointer + keyboard (focus) accessible.
 */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open ? (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md",
            SIDE[side],
            className,
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
