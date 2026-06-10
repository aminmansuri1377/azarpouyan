"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    window.location.href = "/panel/login";
  }

  return <button onClick={logout}>Logout</button>;
}
