"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { Separator } from "@/components/ui/Separator";
import { usePanelSidebar } from "@/lib/panel-sidebar-context";
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
  { href: "/panel/blogs", label: "بلاگ", icon: FileTextIcon },
  { href: "/panel/news", label: "اخبار", icon: FileTextIcon },
  { href: "/panel/articles", label: "مقالات", icon: FileTextIcon },
  { href: "/panel/price-ticker", label: "لیست قیمت ها", icon: DollarSignIcon },
  { href: "/panel/contact-requests", label: "درخواست مشاوره", icon: InboxIcon },
  { href: "/panel/settings", label: "تنظیمات", icon: SettingsIcon },
  { href: "/panel/ui-preview", label: "UI Preview", icon: SettingsIcon },
];

export function PanelSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = usePanelSidebar();

  return (
    <>
      {/* بک‌دراپ فقط در موبایل و وقتی باز است */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-screen w-64 shrink-0 flex-col border-e border-border bg-card transition-transform duration-300 ease-in-out",
          "md:static md:z-auto md:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-base font-peyda-bold text-foreground">
            پنل مدیریت
          </h2>
          <button
            onClick={close}
            aria-label="بستن منو"
            className="rounded-md p-1 text-muted-foreground hover:bg-accent/50 md:hidden"
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
                    onClick={close}
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
    </>
  );
}
