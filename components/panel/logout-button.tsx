"use client";

import { Button } from "@/components/ui/Button";
import { LogoutIcon } from "@/components/ui/icon";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/panel/login";
  }

  return (
    <Button variant="ghost" size="sm" onClick={logout}>
      <LogoutIcon className="size-4" />
      خروج
    </Button>
  );
}
