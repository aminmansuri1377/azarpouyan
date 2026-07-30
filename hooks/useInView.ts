"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** 0–1, how much of the element must be visible to trigger. Default 0.3 */
  threshold?: number;
  /** Same as IntersectionObserver rootMargin, e.g. "0px 0px -100px 0px" */
  rootMargin?: string;
  /** Once true, stop observing (don't flip back to false on scroll out). Default true */
  triggerOnce?: boolean;
}

/**
 * Generic "is this element visible in the viewport" hook.
 * No external deps, SSR-safe, falls back to `true` if IntersectionObserver
 * isn't available.
 *
 * @example
 * const { ref, inView } = useInView<HTMLDivElement>();
 * <div ref={ref}>{inView && "visible!"}</div>
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
) {
  const { threshold = 0.3, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) observer.unobserve(node);
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, inView };
}
