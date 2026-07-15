import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { CheckIcon } from "../icon";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "size-4 [&_svg]:size-3",
  md: "size-5 [&_svg]:size-3.5",
  lg: "size-6 [&_svg]:size-4",
};

/**
 * Accessible checkbox with a custom check mark. Forwards ref + spreads props,
 * so it drops straight into a react-hook-form <Controller>.
 *
 * Controlled usage requires `checked` + `onChange` together.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, size = "md", ...props }, ref) {
    return (
      <span className="relative inline-flex">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "peer appearance-none rounded border border-input bg-input-background shadow-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            "checked:border-primary checked:bg-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            SIZES[size],
            className,
          )}
          {...props}
        />
        <CheckIcon className="pointer-events-none absolute inset-0 m-auto text-primary-foreground opacity-0 peer-checked:opacity-100" />
      </span>
    );
  },
);
