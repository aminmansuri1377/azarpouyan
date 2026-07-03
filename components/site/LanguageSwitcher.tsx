"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { trpc } from "@/lib/trpc/client";
import { LanguageLink } from "./LanguageLink";

export function LanguageSwitcher() {
  const pathname = usePathname();

  const currentLocale = pathname.split("/")[1];

  const { data: languages } = trpc.public.getLanguages.useQuery();

  const { data: paths } = trpc.public.getLocalizedPath.useQuery(
    {
      currentLocale,
      targetLocale: "__all__",
      pathname,
    },
    {
      enabled: false,
    },
  );

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
      }}
    >
      {languages?.map((lang) => (
        <LanguageLink
          key={lang.id}
          lang={lang.code}
          currentLocale={currentLocale}
          pathname={pathname}
        />
      ))}
    </div>
  );
}
