"use client";

import Link from "next/link";

import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "../ui";
import Logo from "../../public/images/logo.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface Props {
  locale: string;
  messages: any;
}

export function Header({ locale, messages }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        "bg-[rgba(var(--secondary-foreground-rgb),0.35)]",
        isScrolled ? "backdrop-blur-md shadow-sm" : "border-transparent",
      )}
    >
      {" "}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 lg:py-10">
        {/* Site name */}
        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Button onClick={() => router.push(`/${locale}/contact`)}>
            {messages.consulting}
          </Button>
          <div className="ms-2 flex items-center gap-2">
            <LanguageSwitcher />
            {/* <ThemeToggle /> */}
          </div>
          <Link
            href={`/${locale}`}
            className="text-sm text-popover transition-colors hover:text-foreground font-peyda-regular"
          >
            {messages.home}
          </Link>

          <Link
            href={`/${locale}/aboutUs`}
            className="text-sm text-popover transition-colors hover:text-foreground font-peyda-regular"
          >
            {messages.aboutUs}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="text-sm text-popover transition-colors hover:text-foreground font-peyda-regular"
          >
            {messages.contactus}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="text-sm text-popover transition-colors hover:text-foreground font-peyda-regular"
          >
            {messages.blogs}
          </Link>
        </nav>
        <Image src={Logo} alt="Logo" />{" "}
        {/* <Link
          href={`/${locale}`}
          className="text-lg font-semibold text-foreground transition-colors hover:text-primary font-peyda-bold"
        >
          {messages.siteName}
        </Link> */}
      </div>
    </header>
  );
}
