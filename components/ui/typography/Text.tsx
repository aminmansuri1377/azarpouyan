import { forwardRef, type ElementType, type HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type TextVariant =
  | "default"
  | "muted"
  | "primary"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info";

export type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

export type TextWeight = "normal" | "medium" | "semibold" | "bold";

const VARIANT_CLASSES: Record<TextVariant, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  destructive: "text-destructive",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
};

const SIZE_CLASSES: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

const WEIGHT_CLASSES: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  /** Truncate to a single line with an ellipsis. */
  truncate?: boolean;
}

/**
 * Semantic text primitive. Renders a <p> by default; pass `as` to change the
 * element (span, div, h1, ...). All styling is driven by Tailwind tokens so it
 * adapts to dark mode and RTL automatically.
 */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    as: Tag = "p",
    variant = "default",
    size = "base",
    weight = "normal",
    truncate = false,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cn(
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        WEIGHT_CLASSES[weight],
        truncate && "truncate",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
});

/**
 * Heading convenience wrappers around <Text>.
 */
export interface HeadingProps extends Omit<TextProps, "as"> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const HEADING_DEFAULTS: Record<
  number,
  { as: ElementType; size: TextSize; weight: TextWeight }
> = {
  1: { as: "h1", size: "3xl", weight: "bold" },
  2: { as: "h2", size: "2xl", weight: "bold" },
  3: { as: "h3", size: "xl", weight: "semibold" },
  4: { as: "h4", size: "lg", weight: "semibold" },
  5: { as: "h5", size: "base", weight: "semibold" },
  6: { as: "h6", size: "sm", weight: "semibold" },
};

export const Heading = forwardRef<HTMLElement, HeadingProps>(function Heading(
  { level = 2, ...props },
  ref,
) {
  const defaults = HEADING_DEFAULTS[level];
  return (
    <Text
      ref={ref}
      as={defaults.as}
      size={props.size ?? defaults.size}
      weight={props.weight ?? defaults.weight}
      {...props}
    />
  );
});
