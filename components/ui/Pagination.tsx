"use client";

import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "./icon";

export interface PaginationProps {
  /** Current page (1-based). */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Number of sibling pages to show on each side of the current. */
  siblingCount?: number;
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Page navigation with ellipsis. Buttons are RTL-aware: in RTL the "previous"
 * chevron points right and vice-versa, so we swap icons based on document dir.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages, siblingCount);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
    >
      <PageButton
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronRightIcon className="size-4 rtl:hidden" />
        <ChevronLeftIcon className="hidden size-4 rtl:block" />
      </PageButton>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex h-9 min-w-9 items-center justify-center px-2 text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <PageButton
            key={p}
            aria-current={p === page ? "page" : undefined}
            active={p === page}
            onClick={() => onPageChange(p)}
          >
            {p}
          </PageButton>
        ),
      )}

      <PageButton
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronLeftIcon className="size-4 rtl:hidden" />
        <ChevronRightIcon className="hidden size-4 rtl:block" />
      </PageButton>
    </nav>
  );
}

function buildPages(
  current: number,
  total: number,
  sibling: number,
): (number | "ellipsis")[] {
  // Always show first, last, current, and `sibling` neighbors.
  const totalNumbers = sibling * 2 + 5;
  if (total <= totalNumbers) return range(1, total);

  const leftSibling = Math.max(current - sibling, 1);
  const rightSibling = Math.min(current + sibling, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const left = range(1, 3 + 2 * sibling);
    return [...left, "ellipsis", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const right = range(total - (3 + 2 * sibling) + 1, total);
    return [1, "ellipsis", ...right];
  }

  return [
    1,
    "ellipsis",
    ...range(leftSibling, rightSibling),
    "ellipsis",
    total,
  ];
}

function PageButton({
  children,
  active,
  disabled,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
