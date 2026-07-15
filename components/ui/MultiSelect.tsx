"use client";

import { useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Badge } from "./Badge";
import { CheckIcon, ChevronDownIcon, XIcon } from "./icon";
import type { DropdownOption } from "./Dropdown";

export interface MultiSelectProps {
  options: DropdownOption[];
  /** Array of selected values. */
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  error?: boolean;
  /** Show selected items as removable chips inside the trigger. */
  showChips?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "min-h-8 text-sm",
  md: "min-h-10 text-sm",
  lg: "min-h-11 text-base",
};

/**
 * Multi-select with removable chips and optional search. Unifies the three
 * near-duplicate `Set`-based toggle components that were copy-pasted across
 * the product/category attribute filters.
 */
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  searchPlaceholder = "Search...",
  emptyMessage = "No options",
  disabled = false,
  error = false,
  showChips = true,
  className,
  size = "md",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(rootRef, () => setOpen(false), open);

  const valueSet = useMemo(() => new Set(value), [value]);

  const selectedOptions = useMemo(
    () => options.filter((o) => valueSet.has(o.value)),
    [options, valueSet],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (val: string) => {
    const next = new Set(valueSet);
    next.has(val) ? next.delete(val) : next.add(val);
    onChange(Array.from(next));
  };

  const remove = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(valueSet);
    next.delete(val);
    onChange(Array.from(next));
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error || undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-input-background px-2 py-1.5 text-start text-foreground shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          SIZES[size],
          error && "border-destructive focus-visible:ring-destructive",
        )}
      >
        {showChips && selectedOptions.length > 0 ? (
          selectedOptions.map((o) => (
            <Badge
              key={o.value}
              variant="secondary"
              size="sm"
              className="gap-1"
            >
              {o.label}
              <span
                role="button"
                tabIndex={-1}
                aria-label={`Remove ${o.label}`}
                onClick={(e) => remove(o.value, e)}
                className="inline-flex rounded-full hover:bg-foreground/10"
              >
                <XIcon className="size-3" />
              </span>
            </Badge>
          ))
        ) : (
          <span className="px-1 text-muted-foreground">{placeholder}</span>
        )}

        <ChevronDownIcon
          className={cn(
            "ms-auto size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
          <div className="relative mb-1 flex items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-sm border border-input bg-input-background px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <ul
            role="listbox"
            className="scrollbar-thin max-h-60 overflow-auto p-0.5"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                {emptyMessage}
              </li>
            ) : (
              filtered.map((option) => {
                const isSelected = valueSet.has(option.value);
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggle(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-3 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      isSelected && "font-medium",
                      option.disabled && "pointer-events-none opacity-50",
                    )}
                  >
                    <span className="inline-flex items-center gap-2 truncate">
                      {option.icon}
                      {option.label}
                    </span>
                    {isSelected ? (
                      <CheckIcon className="size-4 shrink-0 text-primary" />
                    ) : null}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
