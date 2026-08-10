// components/panel/mobile-menu-button.tsx
"use client";

import { usePanelSidebar } from "@/lib/panel-sidebar-context";

export function PanelMobileMenuButton() {
  const { toggle } = usePanelSidebar();

  return (
    <button
      onClick={toggle}
      aria-label="باز کردن منو"
      className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent/50 md:hidden"
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
  );
}
