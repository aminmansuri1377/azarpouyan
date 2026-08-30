"use client";

import { useEffect, useRef } from "react";

/**
 * نوار پیشرفت اسکرول بالای صفحه — فقط در صفحه‌ی اصلی (home) رندر می‌شود.
 *
 * - بدون هیچ re-render: مقدار پیشرفت مستقیم روی transform نوشته می‌شود.
 * - فقط با requestAnimationFrame آپدیت می‌شود (فوق‌العاده سبک).
 * - در حالت RTL از راست و در LTR از چپ رشد می‌کند.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = barRef.current;
      if (!el) return;

      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      el.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]"
    >
      <div
        ref={barRef}
        className="scroll-progress-inner h-full w-full origin-left bg-gradient-to-r from-primary/60 via-primary to-primary/90"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
