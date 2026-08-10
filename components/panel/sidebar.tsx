"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { Separator } from "@/components/ui/Separator";
import {
  HomeIcon,
  PackageIcon,
  SettingsIcon,
  FileTextIcon,
  InboxIcon,
  FilterIcon,
  DollarSignIcon,
} from "@/components/ui/icon";

const links = [
  { href: "/panel", label: "داشبورد", icon: HomeIcon },
  { href: "/panel/categories", label: "دسته بندی", icon: FilterIcon },
  { href: "/panel/products", label: "محصولات", icon: PackageIcon },
  // { href: "/panel/attributes", label: "Attributes", icon: FilterIcon },
  { href: "/panel/blogs", label: "بلاگ", icon: FileTextIcon },
  { href: "/panel/news", label: "اخبار", icon: FileTextIcon },
  { href: "/panel/articles", label: "مقالات", icon: FileTextIcon },
  // { href: "/panel/languages", label: "زبان‌ها", icon: SettingsIcon },
  { href: "/panel/price-ticker", label: "لیست قیمت ها", icon: DollarSignIcon },
  {
    href: "/panel/contact-requests",
    label: "درخواست مشاوره",
    icon: InboxIcon,
  },
  { href: "/panel/settings", label: "تنظیمات", icon: SettingsIcon },
  { href: "/panel/ui-preview", label: "UI Preview", icon: SettingsIcon },
];

export function PanelSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-e border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-base  font-peyda-bold text-foreground">
          پنل مدیریت
        </h2>
        {/* <ThemeToggle /> */}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col gap-1">
          {links.map((item) => {
            const isActive =
              item.href === "/panel"
                ? pathname === "/panel"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
