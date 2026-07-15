import { useState } from "react";

import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<AvatarSize, string> = {
  xs: "size-6 text-xs",
  sm: "size-8 text-sm",
  md: "size-10 text-base",
  lg: "size-12 text-lg",
  xl: "size-16 text-xl",
};

export interface AvatarProps {
  src?: string;
  alt?: string;
  /** Fallback initials shown when no image or on error. */
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

/** Circular avatar with graceful image error fallback to initials. */
export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground",
        SIZES[size],
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{fallback ?? "?"}</span>
      )}
    </span>
  );
}
