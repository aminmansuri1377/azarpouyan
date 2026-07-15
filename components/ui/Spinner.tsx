import { cn } from "@/lib/cn";

export interface SpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  /** Accessible label announced to screen readers. */
  label?: string;
}

/**
 * Lightweight SVG spinner. Sized via className (default 1em; use h-/w- or
 * size-* utilities). Respects prefers-reduced-motion via globals.css.
 */
export function Spinner({ label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
