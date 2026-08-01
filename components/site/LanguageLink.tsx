"use client";

import Link from "next/link";
import { cn } from "@/lib/cn"; // make sure you have this utility
import { trpc } from "@/lib/trpc/client";

interface Props {
  lang: string;
  pathname: string;
  currentLocale: string;
}

export function LanguageLink({ lang, pathname, currentLocale }: Props) {
  const { data } = trpc.public.getLocalizedPath.useQuery({
    currentLocale,
    targetLocale: lang,
    pathname,
  });

  const isSelected = lang === currentLocale;

  return (
    <Link
      href={data?.path ?? "/"}
      className={cn(
        "rounded-md px-2 py-1 text-xs font-medium transition-colors",
        isSelected
          ? "bg-white text-black" // white background with dark text
          : "text-popover hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {lang.toUpperCase()}
    </Link>
  );
}
