"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";

import { trpc } from "@/lib/trpc/client";

export function LanguageSwitcher() {
  const pathname = usePathname();

  const { data } = trpc.public.getLanguages.useQuery();

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
      }}
    >
      {data?.map((lang) => {
        const parts = pathname.split("/");

        parts[1] = lang.code;

        return (
          <Link key={lang.id} href={parts.join("/")}>
            {lang.code.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
