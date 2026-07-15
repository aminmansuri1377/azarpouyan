"use client";

import Link from "next/link";

import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface Props {
  locale: string;
  messages: any;
}

export function Header({ locale, messages }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Site name */}
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold text-foreground transition-colors hover:text-primary"
        >
          {messages.siteName}
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href={`/${locale}/blog`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {messages.blogs}
          </Link>

          <Link
            href={`/${locale}/contact`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {messages.contactus}
          </Link>

          <Link
            href={`/${locale}/news`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {messages.news}
          </Link>

          <div className="ms-2 flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
