"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui";

export default function JournalDownloadButton({
  id,
  label = "دانلود گاهنامه",
  className,
}: {
  id: string;
  label?: string;
  className?: string;
}) {
  const utils = trpc.useUtils();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <span className="inline-flex flex-col gap-2">
      <Button
        className={className}
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const { url } = await utils.client.journal.getDownloadUrl.query({
              id,
            });
            window.location.assign(url);
          } catch (e) {
            setError(e instanceof Error ? e.message : "دریافت فایل انجام نشد");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "در حال آماده‌سازی…" : label}
      </Button>
      {error && (
        <span role="alert" className="text-sm text-red-500">
          {error}
        </span>
      )}
    </span>
  );
}
