import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { Slot } from "./Slot";
import { Spinner } from "./Spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "outline"
  | "ghost"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

const BASE =
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  success: "bg-success text-success-foreground shadow-sm hover:bg-success/90",
  warning: "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90",
  info: "bg-info text-info-foreground shadow-sm hover:bg-info/90",
  outline:
    "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
  ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const SIZE: Record<ButtonSize, string> = {
  xs: "h-7 px-2 text-xs [&_svg]:size-3.5",
  sm: "h-8 px-3 text-sm [&_svg]:size-4",
  md: "h-10 px-4 text-sm [&_svg]:size-4",
  lg: "h-11 px-6 text-base [&_svg]:size-5",
  icon: "h-10 w-10 [&_svg]:size-4",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show a spinner and disable the button. */
  loading?: boolean;
  /** Stretch to the full width of the container. */
  fullWidth?: boolean;
  /**
   * Render the button "as" the single child element (e.g. a Next.js <Link>),
   * merging classes/handlers. Lets the same styled button be used for links.
   */
  asChild?: boolean;
}

/**
 * Polymorphic button. All native button props (onClick, onDoubleClick,
 * onFocus, disabled, type, value, name, ...) pass straight through.
 *
 * @example
 * <Button variant="primary" size="md" onClick={save}>Save</Button>
 * <Button asChild><Link href="/x">Go</Link></Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    const classes = cn(
      BASE,
      VARIANT[variant],
      SIZE[size],
      fullWidth && "w-full",
      className,
    );

    const content = (
      <>
        {loading ? <Spinner className="size-4" /> : null}
        {children}
      </>
    );

    if (asChild) {
      return (
        <Slot ref={ref} className={classes} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled ?? loading}
        {...props}
      >
        {content}
      </button>
    );
  },
);
