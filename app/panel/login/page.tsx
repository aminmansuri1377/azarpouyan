"use client";

import { useState } from "react";

import { trpc } from "@/lib/trpc/client";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");

  const loginMutation = trpc.adminAuth.login.useMutation();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    if (!response.ok) {
      alert("Wrong password");
      return;
    }

    window.location.href = "/panel";
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}
