// lib/panel-sidebar-context.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type PanelSidebarContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const PanelSidebarContext = createContext<PanelSidebarContextType | null>(null);

export function PanelSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PanelSidebarContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((v) => !v),
      }}
    >
      {children}
    </PanelSidebarContext.Provider>
  );
}

export function usePanelSidebar() {
  const ctx = useContext(PanelSidebarContext);
  if (!ctx) {
    throw new Error(
      "usePanelSidebar باید داخل PanelSidebarProvider استفاده بشه",
    );
  }
  return ctx;
}
