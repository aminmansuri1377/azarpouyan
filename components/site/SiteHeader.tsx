"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/site/Header";

interface Props {
  locale: string;
  messages: any;
}

export function SiteHeader({ locale, messages }: Props) {
  const pathname = usePathname();

  // فقط مسیر /fa یا /en یا هر locale دیگری
  const isHomePage = pathname === `/${locale}`;

  return <Header locale={locale} messages={messages} whiteText={isHomePage} />;
}
