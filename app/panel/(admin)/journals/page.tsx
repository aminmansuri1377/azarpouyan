"use client";

import Image from "next/image";
import { normalizeGoogleDriveUrl } from "@/lib/google-drive";
import {
  uploadJournalFileDirect,
  type JournalUploadProgress,
} from "@/lib/upload-journal";
import { JOURNAL_COVER_MAX_MIB } from "@/lib/journal-upload-limits";
import { useRef, useState, type FormEvent } from "react";
import { trpc } from "@/lib/trpc/client";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/trpc/routers/_app";
import JournalDownloadButton from "@/components/site/about/JournalDownloadButton";
import { Button } from "@/components/ui";

type UploadSession = inferRouterOutputs<AppRouter>["journal"]["prepareUpload"];

type Journal = {
  id: string;
  title: string;
  description: string;
  coverKey: string;
  pdfUrl: string | null;
  published: boolean;
  sortOrder: number;
  updatedAt: Date;
};

export default function JournalsPage() {
  const utils = trpc.useUtils();
  const create = trpc.journal.create.useMutation();
  const update = trpc.journal.update.useMutation();
  const deleteJournal = trpc.journal.delete.useMutation();
  const prepareUpload = trpc.journal.prepareUpload.useMutation();
  const pending = useRef<{
    fingerprint: string;
    session: UploadSession;
    coverDone: boolean;
  } | null>(null);
  const [editing, setEditing] = useState<Journal | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [upload, setUpload] = useState<JournalUploadProgress | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const {
    data: journals,
    isPending,
    isError,
    refetch,
  } = trpc.journal.getAll.useQuery();

  function reset() {
    pending.current = null;
    setEditing(null);
    setFormKey((key) => key + 1);
  }
  async function refresh() {
    await Promise.all([
      utils.journal.getAll.invalidate(),
      utils.journal.getPublished.invalidate(),
    ]);
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const selectedCover = form.get("cover");
      const cover =
        selectedCover instanceof File && selectedCover.size > 0
          ? selectedCover
          : undefined;
      if (!editing && !cover) {
        throw new Error("تصویر جلد الزامی است.");
      }
      if (cover && cover.size > JOURNAL_COVER_MAX_MIB * 1024 * 1024) {
        throw new Error(
          `حداکثر حجم تصویر برابر ${JOURNAL_COVER_MAX_MIB} مگابایت است.`,
        );
      }
      const pdfUrl = normalizeGoogleDriveUrl(String(form.get("pdfUrl") || ""));
      if (
        cover &&
        !["image/jpeg", "image/png", "image/webp"].includes(cover.type)
      )
        throw new Error("تصویر باید JPG، PNG یا WebP باشد.");
      const fingerprint = JSON.stringify([
        editing?.id,
        editing?.updatedAt,
        cover ? [cover.name, cover.size, cover.lastModified] : null,
      ]);
      const total = cover?.size || 0;
      setUpload({ phase: "preparing", loaded: 0, total });
      if (
        !pending.current ||
        pending.current.fingerprint !== fingerprint ||
        pending.current.session.expiresAt < Date.now()
      ) {
        const session = await prepareUpload.mutateAsync({
          id: editing?.id,
          version: editing?.updatedAt,
          cover: cover ? { size: cover.size, type: cover.type } : undefined,
        });
        pending.current = {
          fingerprint,
          session,
          coverDone: !cover,
        };
      }
      const job = pending.current;
      if (cover && job.session.cover && !job.coverDone) {
        const signed = job.session.cover;
        setUpload({ phase: "uploading", loaded: 0, total });
        await uploadJournalFileDirect(
          signed.url,
          cover,
          signed.contentType,
          (loaded) => setUpload({ phase: "uploading", loaded, total }),
        );
        job.coverDone = true;
      }
      setUpload({ phase: "saving", loaded: total, total });
      const data = {
        id: job.session.id,
        pdfUrl,
        title: String(form.get("title") || "").trim(),
        description: String(form.get("description") || "").trim(),
        published: form.get("published") === "on",
        sortOrder: Number(form.get("sortOrder")),
      };
      if (editing) {
        if (!job.session.version) {
          throw new Error("نسخهٔ گاهنامه مشخص نیست؛ فهرست را تازه کنید.");
        }
        await update.mutateAsync({
          ...data,
          version: job.session.version,
          coverToken: job.session.cover?.token,
        });
      } else {
        if (!job.session.cover || !job.coverDone) {
          throw new Error("آپلود تصویر جلد کامل نشده است.");
        }
        await create.mutateAsync({
          ...data,
          coverToken: job.session.cover.token,
        });
      }
      setUpload(null);
      reset();
      setMessage("گاهنامه ذخیره شد.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره انجام نشد");
    } finally {
      setUpload(null);
      setBusy(false);
    }
  }
  async function remove(journal: Journal) {
    if (
      !window.confirm(
        `«${journal.title}» و تصویر جلد آن حذف شوند؟ فایل Google Drive حذف نمی‌شود.`,
      )
    )
      return;
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await deleteJournal.mutateAsync({
        id: journal.id,
        version: journal.updatedAt,
      });
      if (editing?.id === journal.id) reset();
      setMessage("گاهنامه حذف شد.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف انجام نشد");
    } finally {
      setBusy(false);
    }
  }
  const uploadPercent =
    upload?.phase === "saving"
      ? 100
      : upload?.total
        ? Math.min(100, Math.floor((upload.loaded / upload.total) * 100))
        : null;
  const input =
    "mt-2 w-full rounded-lg border border-border bg-background p-3 text-foreground";
  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-peyda-bold">مدیریت گاهنامه‌ها</h1>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500 p-3 text-red-500"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="rounded-lg border border-green-600 p-3 text-green-600"
        >
          {message}
        </p>
      )}

      <form
        key={formKey}
        onSubmit={save}
        className="rounded-xl border border-border bg-card p-5"
      >
        <fieldset disabled={busy} className="space-y-4">
          <legend className="mb-4 text-lg font-peyda-bold">
            {editing ? "ویرایش گاهنامه" : "افزودن گاهنامه"}
          </legend>
          <label className="block">
            عنوان
            <input
              name="title"
              required
              maxLength={200}
              defaultValue={editing?.title ?? ""}
              className={input}
            />
          </label>
          <label className="block">
            توضیحات
            <textarea
              name="description"
              required
              maxLength={20000}
              rows={7}
              defaultValue={editing?.description ?? ""}
              className={input}
            />
          </label>
          <label className="block">
            ترتیب نمایش (عدد کوچک‌تر بالاتر)
            <input
              name="sortOrder"
              type="number"
              min={0}
              max={1000000}
              step={1}
              required
              defaultValue={editing?.sortOrder ?? 0}
              className={input}
            />
          </label>
          {editing && (
            <div className="flex items-center gap-4">
              <Image
                src={`/api/image/${editing.coverKey}`}
                alt={editing.title}
                width={160}
                height={120}
                className="rounded-lg object-cover"
              />
              {editing.pdfUrl && (
                <JournalDownloadButton
                  id={editing.id}
                  label="دانلود PDF فعلی"
                />
              )}
            </div>
          )}
          <label className="block">
            تصویر جلد (JPG، PNG، WebP؛ حداکثر ۵ مگابایت)
            <input
              name="cover"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required={!editing}
              className={input}
            />
          </label>
          <label className="block">
            لینک فایل PDF در Google Drive
            <input
              name="pdfUrl"
              type="url"
              dir="ltr"
              required
              maxLength={2048}
              defaultValue={editing?.pdfUrl ?? ""}
              placeholder="https://drive.google.com/file/d/1KpNDUBwlXMd6WrGgF4GS7MYo04jHceER/view?usp=sharing"
              className={input}
            />
          </label>

          <p className="text-sm text-muted-foreground">
            فایل PDF را در Google Drive آپلود کنید و دسترسی آن را روی «Anyone
            with the link» و «Viewer» قرار دهید. سپس لینک اشتراک‌گذاری را در
            کادر بالا وارد کنید.
          </p>
          {editing && (
            <p className="text-sm text-muted-foreground">
              برای نگه‌داشتن تصویر جلد فعلی، تصویر جدید انتخاب نکنید.
            </p>
          )}
          <label className="flex items-center gap-2">
            <input
              name="published"
              type="checkbox"
              defaultChecked={editing?.published ?? false}
            />
            انتشار در سایت
          </label>
          {upload && (
            <div className="space-y-2 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span id="journal-upload-label">
                  {upload.phase === "saving"
                    ? "در حال ثبت گاهنامه…"
                    : upload.phase === "preparing"
                      ? "در حال آماده‌سازی…"
                      : "در حال آپلود تصویر جلد…"}
                </span>
                <span dir="ltr" className="tabular-nums">
                  {uploadPercent === null ? "…" : `${uploadPercent}%`}
                </span>
              </div>
              <div
                role="progressbar"
                aria-labelledby="journal-upload-label"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={uploadPercent ?? undefined}
                aria-valuetext={
                  upload.phase === "saving"
                    ? "ارسال کامل؛ در انتظار تأیید ذخیره"
                    : undefined
                }
                className="h-3 overflow-hidden rounded-full bg-primary/15"
              >
                <div
                  className={`h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none ${uploadPercent === null ? "animate-pulse motion-reduce:animate-none" : ""}`}
                  style={{
                    width:
                      uploadPercent === null ? "100%" : `${uploadPercent}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground" role="status">
                {upload.phase === "saving"
                  ? "لطفاً تا ثبت عنوان، توضیحات و لینک دانلود منتظر بمانید."
                  : upload.total
                    ? `${(upload.loaded / 1024 / 1024).toFixed(1)} از ${(upload.total / 1024 / 1024).toFixed(1)} مگابایت ارسال شده است.`
                    : "در حال ارسال؛ منتظر دریافت میزان پیشرفت…"}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? "در حال انجام…" : "ذخیره گاهنامه"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={reset}>
                انصراف از ویرایش
              </Button>
            )}
          </div>
        </fieldset>
      </form>
      {isPending && <p role="status">در حال دریافت…</p>}
      {isError && (
        <p role="alert">
          دریافت فهرست انجام نشد.{" "}
          <button className="underline" onClick={() => refetch()}>
            تلاش دوباره
          </button>
        </p>
      )}
      {journals?.length === 0 && <p>هنوز گاهنامه‌ای ثبت نشده است.</p>}
      <div className="space-y-4">
        {journals?.map((journal) => (
          <article
            key={journal.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <Image
              src={`/api/image/${journal.coverKey}`}
              alt={journal.title}
              width={120}
              height={90}
              className="rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-peyda-bold">{journal.title}</h2>
            </div>
            {journal.pdfUrl && (
              <JournalDownloadButton id={journal.id} label="دانلود" />
            )}
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => {
                pending.current = null;
                setEditing(journal);
                setFormKey((key) => key + 1);
                setError("");
                setMessage("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ویرایش
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={busy}
              onClick={() => remove(journal)}
            >
              حذف
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
