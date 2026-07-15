import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely.
 * - clsx handles conditional/record/array inputs
 * - twMerge resolves conflicting Tailwind utilities (e.g. "px-2 px-4" -> "px-4")
 *
 * @example
 * cn("px-2", isActive && "bg-primary", "px-4") // -> "bg-primary px-4"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
