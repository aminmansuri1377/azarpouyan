"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useClickOutside } from "@/hooks/useClickOutside";
import { XIcon } from "./icon";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Label the dialog for assistive tech. */
  title?: ReactNode;
  description?: ReactNode;
  /** Footer area (actions). */
  footer?: ReactNode;
  /** Hide the close (X) button. */
  hideCloseButton?: boolean;
  /** Size preset. */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-[calc(100vw-2rem)]",
};

/**
 * Accessible modal dialog. Locks body scroll while open, traps focus inside,
 * and closes on Escape or backdrop click. Render with `open`/`onClose`.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  hideCloseButton = false,
  size = "md",
  className,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Close on Escape + outside click (reusing the hook; panel is the "outside"
  // boundary so we attach the listener to the backdrop instead).
  useClickOutside(panelRef, onClose, open);

  // Body scroll lock + focus management while open.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the panel.
    const t = setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      focusable?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(t);
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "relative z-10 w-full rounded-lg border border-border bg-card text-card-foreground shadow-lg",
          SIZES[size],
          className,
        )}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between gap-4 border-b border-border p-6 pb-4">
            <div className="flex flex-col gap-1">
              {title ? (
                <h2 className="text-lg font-semibold leading-none text-foreground">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {!hideCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-me-2 -mt-1 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <XIcon className="size-4" />
              </button>
            ) : null}
          </div>
        )}

        <div className="p-6">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border p-6 pt-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
