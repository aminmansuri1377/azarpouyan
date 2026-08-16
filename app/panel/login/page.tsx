"use client";

import { useState } from "react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("رمز عبور اشتباه است");
        return;
      }

      window.location.href = "/panel";
    } catch {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#F3F5F8] p-4 sm:p-8 font-peyda-regular"
    >
      <div className="grid w-full max-w-[1200px] overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        {/* تصویر سمت راست در RTL → با order به سمت چپ منتقل می‌شود */}
        <div className="relative hidden min-h-[420px] md:order-2 md:block lg:min-h-[640px]">
          <Image
            src="/images/hero.jpg"
            alt="حمل و نقل دریایی"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* فرم */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 lg:py-20 md:order-1">
          <h1 className="text-center text-3xl font-bold text-black lg:text-4xl">
            ورود به پنل ادمین
          </h1>
          <p className="mt-4 text-center text-sm text-[#7C8698] lg:text-base">
            برای ورود به پنل رمز عبور را وارد کنید
          </p>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
            <div className="relative">
              <label
                htmlFor="password"
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm text-[#4B5563]"
              >
                رمز عبور :
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[58px] w-full rounded-xl border border-[#BF934B] bg-white pr-[104px] pl-5 text-left text-[#0D162B] outline-none transition focus:border-[#A87C38] focus:ring-2 focus:ring-[#BF934B]/25"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading || password.length === 0}
              className="mt-8 h-[58px] w-full rounded-xl bg-[#BF934B] text-base font-medium text-white transition hover:bg-[#A87C38] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
