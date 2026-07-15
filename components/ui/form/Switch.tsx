import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "md" | "lg";
}

const TRACK = {
  sm: "h-4 w-7",
  md: "h-5 w-9",
  lg: "h-6 w-11",
};

const THUMB = {
  sm: "size-3 peer-checked:translate-x-3 rtl:peer-checked:-translate-x-3",
  md: "size-4 peer-checked:translate-x-4 rtl:peer-checked:-translate-x-4",
  lg: "size-5 peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5",
};

/**
 * Toggle switch (a styled checkbox under the hood). Same controlled/uncontrolled
 * semantics as a native checkbox. RTL-safe thumb travel via logical translate.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, size = "md", ...props },
  ref,
) {
  return (
    <label
      className={cn(
        "relative inline-flex cursor-pointer items-center",
        props.disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span
        className={cn(
          "rounded-full bg-input transition-colors",
          "peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          TRACK[size],
        )}
      />
      <span
        className={cn(
          "absolute start-0.5 rounded-full bg-foreground shadow transition-transform",
          "peer-checked:bg-primary-foreground",
          THUMB[size],
        )}
      />
    </label>
  );
});
