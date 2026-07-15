"use client";

import Link from "next/link";

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

  return (
    <Link
      href={data?.path ?? "/"}
      className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {lang.toUpperCase()}
    </Link>
  );
}
