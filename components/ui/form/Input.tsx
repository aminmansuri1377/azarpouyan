import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { EyeIcon, EyeOffIcon } from "../icon";

const SIZES = {
  sm: "h-8 text-sm",
  md: "h-10 text-sm",
  lg: "h-11 text-base",
};

const baseField =
  "w-full font-peyda-regular px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS = {
  /** Default light form field (existing look, used on light backgrounds). */
  default:
    "rounded-md border border-input bg-input-background text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background",
  /**
   * Transparent field with a white border, for use on dark / image
   * backgrounds — e.g. the "Contact us" glass panels in Figma. Rounded per
   * request (the Figma export itself had square corners, 2px solid white
   * borders, no radius).
   */
  glass:
    "rounded-2xl border-2 border-white bg-transparent text-white placeholder:text-white/70 focus-visible:ring-white/60 focus-visible:ring-offset-transparent",
};

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** Field size. */
  size?: keyof typeof SIZES;
  /** Visual style. `glass` = transparent + white border, for dark panels. */
  variant?: keyof typeof VARIANTS;
  /** Red border + aria to signal a validation error. */
  error?: boolean;
  /** Render a show/hide password toggle (forces type text internally). */
  withPasswordToggle?: boolean;
  /** Optional leading icon node (rendered inside, before the text). */
  leftIcon?: React.ReactNode;
}

/**
 * Text input. Because it forwards a ref and spreads all native props, it works
 * transparently with react-hook-form's `register()` and `Controller`.
 *
 * @example
 * <Input {...register("email")} error={!!errors.email} />
 * <Input variant="glass" placeholder="Email" /> // on a dark/glass panel
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    size = "md",
    variant = "default",
    error = false,
    withPasswordToggle = false,
    leftIcon,
    type = "text",
    disabled,
    ...props
  },
  ref,
) {
  const [show, setShow] = useState(false);
  const computedType = withPasswordToggle ? (show ? "text" : "password") : type;

  return (
    <div className="relative flex items-center">
      {leftIcon ? (
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground">
          {leftIcon}
        </span>
      ) : null}

      <input
        ref={ref}
        type={computedType}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          baseField,
          SIZES[size],
          VARIANTS[variant],
          leftIcon && "ps-9",
          withPasswordToggle && "pe-9",
          error &&
            (variant === "glass"
              ? "border-destructive focus-visible:ring-destructive"
              : "border-destructive focus-visible:ring-destructive font-peyda-regular"),
          className,
        )}
        {...props}
      />

      {withPasswordToggle ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className={cn(
            "absolute inset-y-0 end-0 flex items-center pe-3",
            variant === "glass"
              ? "text-white/70 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {show ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </button>
      ) : null}
    </div>
  );
});
