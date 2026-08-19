"use client";

import { useLayoutEffect } from "react";

const RTL_LOCALES = ["fa", "ar", "he", "ur", "ps", "sd"];

export function LocaleDirSync({ locale }: { locale: string }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

    root.setAttribute("dir", dir);
    root.setAttribute("lang", locale);

    // جلوگیری از اینکه اسکرول افقی باقی‌مانده از حالت rtl قبلی
    // روی محتوای ltr جدید (یا برعکس) بمونه و صفحه رو کج نشون بده
    window.scrollTo({ left: 0 });
  }, [locale]);

  return null;
}
