"use client";

import { Header } from "@/components/site/Header";
import type { getMessages } from "@/messages";

interface Props {
  locale: string;
  messages: ReturnType<typeof getMessages>;
}

export function SiteHeader({ locale, messages }: Props) {
  return <Header locale={locale} messages={messages} />;
}
