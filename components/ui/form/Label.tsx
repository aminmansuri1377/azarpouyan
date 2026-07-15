import { forwardRef, type LabelHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Mark the field as required (renders a red asterisk). */
  required?: boolean;
}

/**
 * Accessible form label. Pairs with Input/Select/Textarea via `htmlFor`.
 * The required asterisk uses logical placement so RTL is correct.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, required, children, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium leading-none text-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
});
