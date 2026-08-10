import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth/get-admin-session";
import { PanelSidebar } from "@/components/panel/sidebar";
import { LogoutButton } from "@/components/panel/logout-button";
import { PanelSidebarProvider } from "@/lib/panel-sidebar-context";
import { PanelMobileMenuButton } from "@/components/panel/mobile-menu-button";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await getAdminSession();

  if (!loggedIn) {
    redirect("/panel/login");
  }

  return (
    <PanelSidebarProvider>
      <div className="flex min-h-screen">
        <PanelSidebar />

        <main className="flex-1 overflow-auto">
          {/* Top bar */}
          <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <LogoutButton />
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-foreground">panel</h1>
              <PanelMobileMenuButton />
            </div>
          </div>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </PanelSidebarProvider>
  );
}
