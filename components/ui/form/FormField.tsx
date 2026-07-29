import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Label, type LabelProps } from "./Label";
import { Text } from "../typography/Text";

export interface FormFieldProps {
  /** id passed to both Label (htmlFor) and the field — wires a11y pairing. */
  htmlFor?: string;
  label?: ReactNode;
  /** Render-prop or node for the control (Input, Select, ...). */
  children: ReactNode;
  /** Validation error string(s) from react-hook-form's `errors`. */
  error?: string | string[] | null;
  /** Helper text shown under the field when there's no error. */
  hint?: ReactNode;
  required?: boolean;
  labelProps?: Omit<LabelProps, "htmlFor" | "required">;
  className?: string;
}

/**
 * Wraps a label, a control, and an error/hint message. Centralizes the
 * layout that was copy-pasted in every form. The control itself (Input,
 * Select, ...) is passed as children; pass `htmlFor` matching its `id`.
 */
export function FormField({
  htmlFor,
  label,
  children,
  error,
  hint,
  required,
  labelProps,
  className,
}: FormFieldProps) {
  const errorText = Array.isArray(error) ? error[0] : error;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label
          htmlFor={htmlFor}
          required={required}
          {...labelProps}
          className="text-popover font-peyda-regular"
        >
          {label}
        </Label>
      ) : null}

      {children}

      {errorText ? (
        <Text variant="destructive" size="sm" role="alert">
          {errorText}
        </Text>
      ) : hint ? (
        <Text variant="muted" size="sm">
          {hint}
        </Text>
      ) : null}
    </div>
  );
}
