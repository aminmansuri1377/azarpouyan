import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { CheckIcon, InfoIcon, XIcon, AlertTriangleIcon } from "./icon";

export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive";

const VARIANTS: Record<
  AlertVariant,
  { container: string; icon: typeof InfoIcon }
> = {
  default: {
    container: "bg-card text-card-foreground border-border",
    icon: InfoIcon,
  },
  info: {
    container: "border-info/30 bg-info/10 text-info [&_strong]:text-info",
    icon: InfoIcon,
  },
  success: {
    container:
      "border-success/30 bg-success/10 text-success [&_strong]:text-success",
    icon: CheckIcon,
  },
  warning: {
    container:
      "border-warning/30 bg-warning/10 text-warning [&_strong]:text-warning",
    icon: AlertTriangleIcon,
  },
  destructive: {
    container:
      "border-destructive/30 bg-destructive/10 text-destructive [&_strong]:text-destructive",
    icon: XIcon,
  },
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  /** Hide the leading icon. */
  hideIcon?: boolean;
  /** Accessible role. Defaults to "alert" for destructive/warning, else "status". */
  role?: string;
}

/** Inline message banner for form/server feedback. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant = "default", hideIcon = false, role, children, ...props },
  ref,
) {
  const { container, icon: Icon } = VARIANTS[variant];
  const implicitRole =
    role ?? (variant === "destructive" || variant === "warning" ? "alert" : "status");

  return (
    <div
      ref={ref}
      role={implicitRole}
      className={cn(
        "relative w-full rounded-lg border p-4 text-sm",
        container,
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {hideIcon ? null : (
          <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
});

export function AlertTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  );
}
