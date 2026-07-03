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

  return <Link href={data?.path ?? "/"}>{lang.toUpperCase()}</Link>;
}
