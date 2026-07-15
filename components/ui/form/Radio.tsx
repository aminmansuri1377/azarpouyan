import {
  createContext,
  forwardRef,
  useContext,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

const SIZES = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: keyof typeof SIZES;
}

/** A single radio input styled as a ring with a filled center when checked. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, size = "md", ...props },
  ref,
) {
  return (
    <span className="relative inline-flex">
      <input
        ref={ref}
        type="radio"
        className={cn(
          "peer appearance-none rounded-full border border-input bg-input-background shadow-sm transition-colors",
          "checked:border-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          SIZES[size],
          className,
        )}
        {...props}
      />
      <span className="pointer-events-none absolute inset-0 m-auto hidden size-1/2 rounded-full bg-primary peer-checked:block" />
    </span>
  );
});

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  /** Layout direction of the options. */
  orientation?: "vertical" | "horizontal";
}

/**
 * Controlled radio group. Pair with <RadioGroupItem> children.
 */
export function RadioGroup({
  name,
  value,
  onChange,
  children,
  className,
  orientation = "vertical",
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange: onChange ?? (() => {}) }}>
      <div
        role="radiogroup"
        className={cn(
          "flex gap-2",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          className,
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

/** Radio bound to its parent <RadioGroup> by value. */
export function RadioGroupItem({
  value,
  id,
  disabled,
  className,
}: RadioGroupItemProps) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error("RadioGroupItem must be used within a <RadioGroup>.");
  }
  return (
    <Radio
      id={id}
      name={ctx.name}
      value={value}
      disabled={disabled}
      checked={ctx.value === value}
      onChange={() => ctx.onChange(value)}
      className={className}
    />
  );
}
