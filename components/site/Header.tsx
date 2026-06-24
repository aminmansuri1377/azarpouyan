"use client";

import Link from "next/link";

import { LanguageSwitcher } from "./LanguageSwitcher";

interface Props {
  locale: string;
  messages: any;
}

export function Header({ locale, messages }: Props) {
  return (
    <header
      style={{
        padding: 20,
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Link href={`/${locale}`}>{messages.siteName}</Link>

      <nav
        style={{
          display: "flex",
          gap: 20,
        }}
      >
        <Link href={`/${locale}/blog`}>{messages.blogs}</Link>
        <Link href={`/${locale}/contact`}>{messages.contactus}</Link>

        <Link href={`/${locale}/news`}>{messages.news}</Link>

        <LanguageSwitcher />
      </nav>
    </header>
  );
}
