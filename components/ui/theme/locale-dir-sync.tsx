"use client";

import { useEffect } from "react";

const RTL_LOCALES = ["fa", "ar", "he", "ur", "ps", "sd"];

/**
 * Keeps `<html dir="...">` and `<html lang="...">` in sync with the active
 * locale. Tailwind v4 logical utilities (ps-, pe-, ms-, me-, text-start, ...)
 * automatically flip once `dir` is set, so components themselves stay
 * direction-agnostic.
 *
 * Drop one instance inside the locale layout. It renders nothing.
 */
export function LocaleDirSync({ locale }: { locale: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
    root.setAttribute("dir", dir);
    root.setAttribute("lang", locale);
  }, [locale]);

  return null;
}
