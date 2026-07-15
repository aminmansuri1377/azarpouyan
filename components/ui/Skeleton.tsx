import { cn } from "@/lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Animated placeholder block. Respects prefers-reduced-motion. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        "motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
