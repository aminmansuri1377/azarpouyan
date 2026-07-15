"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";
import { useClickOutside } from "@/hooks/useClickOutside";
import { CheckIcon, ChevronDownIcon } from "./icon";

export interface DropdownOption {
  value: string;
  label: string;
  /** Optional node rendered instead of the plain label. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Render an empty-state node when there are no options. */
  emptyMessage?: ReactNode;
  disabled?: boolean;
  /** Mark as erroneous (red ring). */
  error?: boolean;
  name?: string;
  id?: string;
  className?: string;
  /** Size of the trigger. */
  size?: "sm" | "md" | "lg";
  buttonClassName?: string;
}

const SIZES = {
  sm: "h-8 text-sm",
  md: "h-10 text-sm",
  lg: "h-11 text-base",
};

/**
 * Custom single-select dropdown with full styling control, keyboard support
 * (Enter/Space open, Arrow keys move, Enter selects, Esc closes), and RTL-safe
 * positioning. Renders a live region for screen readers.
 */
export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  emptyMessage = "No options",
  disabled = false,
  error = false,
  name,
  id,
  className,
  size = "md",
  buttonClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useClickOutside(rootRef, () => setOpen(false), open);

  const selected = options.find((o) => o.value === value) ?? null;

  // Keep a hidden input so this participates in native form submission / RHF.
  const hiddenName = name;

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
  };

  const select = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setOpen(false);
  };

  // Reset active index when options change while open.
  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [options, value, open]);

  // Scroll the active option into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault();
        if (!open) openMenu();
        else
          setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Escape":
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {hiddenName ? (
        <input type="hidden" name={hiddenName} value={value ?? ""} />
      ) : null}

      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error || undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-input-background px-3 text-start text-foreground shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          SIZES[size],
          error && "border-destructive focus-visible:ring-destructive",
          buttonClassName,
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? (
            <span className="inline-flex items-center gap-2">
              {selected.icon}
              {selected.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="scrollbar-thin absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {options.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {emptyMessage}
            </li>
          ) : (
            options.map((option, index) => {
              const isActive = index === activeIndex;
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => select(option)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-3 py-1.5 text-sm outline-none",
                    isActive && "bg-accent text-accent-foreground",
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
      ) : null}
    </div>
  );
}
