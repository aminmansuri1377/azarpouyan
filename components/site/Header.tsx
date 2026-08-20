"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button, Separator } from "../ui";
import Logo from "../../public/images/logo.png";
import BlackLogo from "../../public/images/blacklogo.png";

interface Props {
  locale: string;
  messages: any;
  whiteText?: boolean;
}

export function Header({ locale, messages, whiteText }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

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
    {
      href: `/${locale}`,
      label: messages.home,
    },
    {
      href: `/${locale}/aboutUs`,
      label: messages.aboutUs,
    },
    {
      href: `/${locale}/contact`,
      label: messages.contactus,
    },
    {
      href: `/${locale}/blog`,
      label: messages.articles,
    },
    {
      href: `/${locale}/workExamples`,
      label: messages.workExamples,
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "backdrop-blur-md shadow-sm bg-[rgba(var(--secondary-foreground-rgb),0.55)]"
          : "",
      )}
    >
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="hidden gap-4 md:flex">
          <Button onClick={() => router.push(`/${locale}/contact`)}>
            {messages.consulting}
          </Button>

          {/* <div className="ms-2 flex items-center gap-2">
            <LanguageSwitcher />
          </div> */}
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-bold transition-colors font-peyda-regular",
                  isActive
                    ? "text-primary"
                    : whiteText
                      ? "text-white"
                      : "text-black",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* =========================
            Mobile Hamburger
        ========================== */}
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="باز کردن منو"
          className={`flex size-10 items-center justify-center rounded-full border  ${whiteText ? "text-white border-white/20" : "text-black border-black"} md:hidden`}
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

        {/* =========================
            Logo
        ========================== */}
        <Image
          src={whiteText ? Logo : BlackLogo}
          alt="Logo"
          width={80}
          onClick={() => router.push(`/${locale}`)}
          className="cursor-pointer"
        />
      </div>

      {/* =========================
          Mobile Backdrop
      ========================== */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

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

        {/* Mobile Navigation */}
        {navLinks.map((link) => {
          const isActive = isLinkActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "rounded-md px-2 py-3 text-base transition-colors font-peyda-regular",
                isActive
                  ? "text-primary"
                  : "text-popover hover:bg-white/10 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Language */}
        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <LanguageSwitcher />
        </div>

        {/* Consulting */}
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

      {/* Separator */}
      <div className="md:mx-20">
        <Separator className={cn(isScrolled && "hidden")} />
      </div>
    </header>
  );
}
