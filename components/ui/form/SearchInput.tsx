"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { SearchIcon, XIcon } from "../icon";

const SIZES = {
  sm: "h-8 text-sm",
  md: "h-10 text-sm",
  lg: "h-11 text-base",
};

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  size?: keyof typeof SIZES;
  /** Controlled value must be passed for the clear button to show. */
  value?: string;
  onClear?: () => void;
}

/**
 * Search input with a leading icon and an optional clear button. Controlled
 * (pass value + onChange). On clear, calls `onClear` if provided, else sets "".
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { className, size = "md", value, onChange, onClear, placeholder, ...props },
    ref,
  ) {
    const [internal, setInternal] = useState("");
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;

    const showClear = current && current.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternal(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) setInternal("");
      onClear?.();
      // Synthesize an onChange so react-hook-form / consumers stay in sync.
      onChange?.({
        target: { value: "" },
        currentTarget: { value: "" },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground">
          <SearchIcon className="size-4" />
        </span>

        <input
          ref={ref}
          type="search"
          value={current}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-md border border-input bg-input-background ps-9 pe-9 text-foreground shadow-sm transition-colors placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            SIZES[size],
            className,
          )}
          {...props}
        />

        {showClear ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        ) : null}
      </div>
    );
  },
);
