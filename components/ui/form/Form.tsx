"use client";

import {
  createContext,
  useContext,
  useId,
  useMemo,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

import { cn } from "@/lib/cn";
import { Label } from "./Label";
import { Text } from "../typography/Text";

/**
 * ----------------------------------------------------------------------------
 *  Lightweight react-hook-form integration — no shadcn/ui, no extra deps.
 *
 *  Every form in this project uses `useForm` + `register`/`Controller` and
 *  repeats the same label + control + error wiring per field. This <Form>
 *  context exposes the RHF instance to descendants so a <FormField> can look
 *  up the error message for its `name` automatically.
 *
 *  It does NOT take over registration. You still call `register("x")` or use
 *  `<Controller>` as usual — this only removes the repetitive glue.
 * ----------------------------------------------------------------------------
 */

/**
 * The context stores the form instance erased to FieldValues so there is a
 * single provider type. <FormField> re-erases, so consumers don't annotate.
 */
const FormContext = createContext<UseFormReturn<FieldValues> | null>(null);

export interface FormProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /**
   * The react-hook-form instance returned by `useForm(...)`.
   * Generic params are intentionally erased for the provider.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any, any, any>;
  children: ReactNode;
}

/**
 * Binds a react-hook-form instance to a <form>.
 *
 * @example
 * const form = useForm({ resolver: zodResolver(schema) });
 * <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>...</Form>
 */
export function Form({ form, children, ...props }: FormProps) {
  return (
    <FormContext.Provider value={form as unknown as UseFormReturn<FieldValues>}>
      <form {...props}>{children}</form>
    </FormContext.Provider>
  );
}

/** Access the bound form instance. Returns null when used outside a <Form>. */
export function useFormContextSafe<T extends FieldValues = FieldValues>() {
  const ctx = useContext(FormContext);
  return (ctx as unknown as UseFormReturn<T> | null) ?? null;
}

/* ----------------------------------------------------------------------------
 *  FormField — one field row. Provides its name + a generated id to children
 *  via context, so FormLabel/FormControl/FormMessage stay declarative.
 * ------------------------------------------------------------------------- */

interface FormFieldContextValue {
  name: string;
  fieldId: string;
  descriptionId: string;
  errorId: string;
  error?: string;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export interface FormFieldProps {
  /** Path of the field, e.g. "email" or "translations.0.title". */
  name: string;
  /** Override the auto-generated control id. */
  id?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({ name, id, className, children }: FormFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `${autoId}-field`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  const form = useContext(FormContext);

  // react-hook-form supports dot-paths in formState.errors, typed loosely here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = resolveErrorPath(form?.formState?.errors, name);

  const value = useMemo<FormFieldContextValue>(
    () => ({ name, fieldId, descriptionId, errorId, error }),
    [name, fieldId, descriptionId, errorId, error],
  );

  return (
    <FormFieldContext.Provider value={value}>
      <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const ctx = useContext(FormFieldContext);
  if (!ctx) {
    throw new Error("useFormField must be used within a <FormField>.");
  }
  return ctx;
}

/** Walk a dot/bracket path through a react-hook-form errors object. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveErrorPath(errors: any, path: string): string | undefined {
  if (!errors) return undefined;
  const parts = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let current = errors;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current?.message as string | undefined;
}

/* ----------------------------------------------------------------------------
 *  FormLabel / FormDescription / FormMessage
 * ------------------------------------------------------------------------- */

export function FormLabel({
  required,
  className,
  children,
}: {
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const { fieldId, errorId } = useFormField();
  return (
    <Label
      htmlFor={fieldId}
      required={required}
      className={className}
      aria-describedby={errorId}
    >
      {children}
    </Label>
  );
}

export function FormDescription({ children }: { children: ReactNode }) {
  const { descriptionId } = useFormField();
  return (
    <Text id={descriptionId} variant="muted" size="sm">
      {children}
    </Text>
  );
}

export function FormMessage({ fallback }: { fallback?: string } = {}) {
  const { error, errorId } = useFormField();
  if (!error) return null;
  return (
    <Text id={errorId} variant="destructive" size="sm" role="alert">
      {error || fallback}
    </Text>
  );
}

/* ----------------------------------------------------------------------------
 *  FormControl — bridges a Controller field or a registered input to the
 *  field id/aria. Optional convenience, not required for `register()` use.
 * ------------------------------------------------------------------------- */

export interface FormControlProps {
  field?: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
  className?: string;
  children: ReactNode;
}

/** Minimal helper: injects id + aria from the surrounding FormField. */
export function FormControl({ children }: FormControlProps) {
  const { fieldId, errorId, descriptionId, error } = useFormField();
  // We can't clone arbitrary children reliably, but we expose the ids so the
  // consumer's Input/Select (which already take `id`/`aria-*`) can wire up.
  return (
    <span
      data-field-id={fieldId}
      data-error-id={errorId}
      data-description-id={descriptionId}
      aria-invalid={!!error}
      className="contents"
    >
      {children}
    </span>
  );
}

// Re-export so consumers can import everything from one place.
export type { ControllerRenderProps, FieldPath, FieldValues, UseFormReturn };
