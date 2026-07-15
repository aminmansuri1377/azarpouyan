import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type BoxDisplay =
  | "block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "hidden";

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout mode. */
  display?: BoxDisplay;
  /** Flex direction (only meaningful when display is flex). */
  direction?: "row" | "column";
  /** Main-axis alignment. */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Cross-axis alignment. */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Gap between children (Tailwind spacing scale). */
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8";
  /** Wrap children onto new lines. */
  wrap?: boolean;
  padding?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8";
}

const DISPLAY: Record<BoxDisplay, string> = {
  block: "block",
  flex: "flex",
  "inline-flex": "inline-flex",
  grid: "grid",
  hidden: "hidden",
};

const DIRECTION: Record<NonNullable<BoxProps["direction"]>, string> = {
  row: "flex-row",
  column: "flex-col",
};

const JUSTIFY: Record<NonNullable<BoxProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const ALIGN: Record<NonNullable<BoxProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const GAP: Record<NonNullable<BoxProps["gap"]>, string> = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
};

const PAD: Record<NonNullable<BoxProps["padding"]>, string> = {
  "0": "p-0",
  "1": "p-1",
  "2": "p-2",
  "3": "p-3",
  "4": "p-4",
  "5": "p-5",
  "6": "p-6",
  "8": "p-8",
};

/**
 * Generic layout box — a prop-driven div for quick layout without writing long
 * className strings. Pairs well with the design-system spacing scale. Use the
 * raw `className` for anything bespoke.
 *
 * @example
 * <Box flex gap="4" direction="column" padding="4">...</Box>
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
  {
    className,
    display = "block",
    direction,
    justify,
    align,
    gap,
    wrap = false,
    padding,
    ...props
  },
  ref,
) {
  const isFlex = display === "flex" || display === "inline-flex";
  return (
    <div
      ref={ref}
      className={cn(
        DISPLAY[display],
        isFlex && direction && DIRECTION[direction],
        isFlex && justify && JUSTIFY[justify],
        isFlex && align && ALIGN[align],
        isFlex && gap && GAP[gap],
        isFlex && wrap && "flex-wrap",
        padding && PAD[padding],
        className,
      )}
      {...props}
    />
  );
});
