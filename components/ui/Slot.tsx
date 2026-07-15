import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
} from "react";

/**
 * Minimal Radix-style <Slot>. Merges its own props onto the single child
 * element so a component can render "as" the child (e.g. <Button asChild>
 * rendering a Next.js <Link>). Lets us avoid adding a dependency.
 *
 * className is concatenated; any other conflicting prop from the child wins
 * (child props take precedence), except event handlers and refs which are
 * merged.
 */
function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T>).current = node;
    }
  };
}

type SlotProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  if (!isValidElement(children)) {
    // No element to merge onto — just render children as-is.
    return <>{children}</>;
  }

  const child = children as ReactElement<any>;
  const childProps = child.props;

  // Merge className.
  const mergedClassName = [slotProps.className, childProps.className]
    .filter(Boolean)
    .join(" ");

  // Merge event handlers: call both child's and slot's handler.
  const eventHandlers: Record<string, unknown> = {};
  for (const key in slotProps) {
    if (key.startsWith("on")) {
      const slotHandler = (slotProps as any)[key];
      const childHandler = (childProps as any)[key];
      eventHandlers[key] = (e: unknown) => {
        childHandler?.(e);
        slotHandler?.(e);
      };
    }
  }

  return cloneElement(child, {
    ...slotProps,
    ...childProps,
    className: mergedClassName || undefined,
    ref: mergeRefs(
      forwardedRef,
      (child as any).ref,
    ),
    ...eventHandlers,
  });
});
