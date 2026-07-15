import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Remove default bullets and spacing for a clean stacked list. */
  unstyled?: boolean;
  /** Visual divider between items. */
  divide?: boolean;
}

/** Unstyled-by-default list container. */
export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { className, unstyled = false, divide = false, ...props },
  ref,
) {
  return (
    <ul
      ref={ref}
      className={cn(
        !unstyled && "list-disc ps-6",
        divide && "divide-y divide-border",
        className,
      )}
      {...props}
    />
  );
});

export const ListItem = forwardRef<
  HTMLLIElement,
  HTMLAttributes<HTMLLIElement>
>(function ListItem({ className, ...props }, ref) {
  return (
    <li
      ref={ref}
      className={cn(
        "marker:text-muted-foreground",
        "[&>ul]:mt-1 [&>ol]:mt-1",
        className,
      )}
      {...props}
    />
  );
});

export interface EmptyStateProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Friendly placeholder for empty lists/tables. */
export function EmptyState({
  title = "Nothing here yet",
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-10 text-center",
        className,
      )}
    >
      {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
