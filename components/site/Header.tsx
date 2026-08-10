"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "../ui";
import Logo from "../../public/images/logo.png";

interface Props {
  locale: string;
  messages: any;
}

export function Header({ locale, messages }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // قفل اسکرول پس‌زمینه وقتی منوی موبایل بازه
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: `/${locale}`, label: messages.home },
    { href: `/${locale}/aboutUs`, label: messages.aboutUs },
    { href: `/${locale}/contact`, label: messages.contactus },
    { href: `/${locale}/blog`, label: messages.blogs },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "backdrop-blur-md shadow-sm bg-[rgba(var(--secondary-foreground-rgb),0.35)]"
          : "border-transparent bg-[rgba(var(--secondary-foreground-rgb),0.9)]",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 lg:py-10">
        {/* Navigation - دسکتاپ */}
        <nav className="hidden items-center gap-8 md:flex">
          <Button onClick={() => router.push(`/${locale}/contact`)}>
            {messages.consulting}
          </Button>
          <div className="ms-2 flex items-center gap-2">
            <LanguageSwitcher />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-popover transition-colors hover:text-foreground font-peyda-regular"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* دکمه همبرگر - فقط موبایل */}
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="باز کردن منو"
          className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        <Image src={Logo} alt="Logo" />
      </div>

      {/* بک‌دراپ موبایل */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* پنل منوی موبایل */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80%] flex-col gap-2 bg-[rgba(var(--secondary-foreground-rgb),0.97)] p-6 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <Image src={Logo} alt="Logo" className="h-8 w-auto" />
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="بستن منو"
            className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className="rounded-md px-2 py-3 text-base text-popover transition-colors hover:bg-white/10 hover:text-foreground font-peyda-regular"
          >
            {link.label}
          </Link>
        ))}

        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <LanguageSwitcher />
        </div>

        <Button
          onClick={() => {
            setIsMenuOpen(false);
            router.push(`/${locale}/contact`);
          }}
          className="mt-2 w-full"
        >
          {messages.consulting}
        </Button>
      </div>
    </header>
  );
}
