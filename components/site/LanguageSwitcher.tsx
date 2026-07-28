"use client";

import { usePathname } from "next/navigation";

import { trpc } from "@/lib/trpc/client";
import { LanguageLink } from "./LanguageLink";
import { Spinner } from "../ui/Spinner";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];

  const { data: languages } = trpc.public.getLanguages.useQuery();

  return (
    <div className="flex items-center gap-2">
      {languages ? (
        languages?.map((lang) => (
          <LanguageLink
            key={lang.id}
            lang={lang.code}
            currentLocale={currentLocale}
            pathname={pathname}
          />
        ))
      ) : (
        <div>
          {" "}
          <Spinner className="size-4" />
        </div>
      )}
    </div>
  );
}
