import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "../icon";

const SIZES = {
  sm: "h-8 text-sm",
  md: "h-10 text-sm",
  lg: "h-11 text-base",
};

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: keyof typeof SIZES;
  error?: boolean;
  /** Optional placeholder shown as the first, disabled option. */
  placeholder?: string;
}

/**
 * Styled native <select>. Fully accessible, keyboard-friendly, mobile-native
 * picker, and works directly with react-hook-form `register()`.
 *
 * The custom chevron sits on the inline-end so it flips with `dir`.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className,
    size = "md",
    error = false,
    placeholder,
    children,
    defaultValue,
    value,
    ...props
  },
  ref,
) {
  return (
    <div className="relative inline-flex w-full items-center">
      <select
        ref={ref}
        aria-invalid={error || undefined}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          "w-full appearance-none rounded-md border border-input bg-input-background px-3 pe-9 text-foreground shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          SIZES[size],
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>

      <ChevronDownIcon className="pointer-events-none absolute end-3 size-4 text-muted-foreground" />
    </div>
  );
});
