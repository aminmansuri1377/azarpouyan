import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth/get-admin-session";

import { PanelSidebar } from "@/components/panel/sidebar";

import { LogoutButton } from "@/components/panel/logout-button";

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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <PanelSidebar />

      <main
        style={{
          flex: 1,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1>CMS</h1>

          <LogoutButton />
        </div>

        {children}
      </main>
    </div>
  );
}
