"use client";

import { useState } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/trpc/routers/_app";
import { trpc } from "@/lib/trpc/client";
import type { CommentValues } from "@/lib/comment-schema";
import { Button } from "@/components/ui";
import CommentForm from "@/components/comments/CommentForm";
import CommentCard from "@/components/comments/CommentCard";

type Comment = inferRouterOutputs<AppRouter>["comment"]["getAll"][number];

export default function CommentsPage() {
  const utils = trpc.useUtils();
  const list = trpc.comment.getAll.useQuery();
  const create = trpc.comment.create.useMutation();
  const update = trpc.comment.update.useMutation();
  const remove = trpc.comment.delete.useMutation();
  const [editing, setEditing] = useState<Comment | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function reset() {
    setEditing(null);
    setFormKey((key) => key + 1);
  }
  async function refresh() {
    await Promise.all([
      utils.comment.getAll.invalidate(),
      utils.comment.getPublished.invalidate(),
    ]);
  }
  async function save(values: CommentValues) {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      if (editing)
        await update.mutateAsync({
          ...values,
          id: editing.id,
          version: editing.updatedAt,
        });
      else await create.mutateAsync(values);
      reset();
      setMessage("نظر ذخیره شد.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }
  async function deleteComment(comment: Comment) {
    if (!window.confirm(`نظر «${comment.fullName}» حذف شود؟`)) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      await remove.mutateAsync({ id: comment.id, version: comment.updatedAt });
      if (editing?.id === comment.id) reset();
      setMessage("نظر حذف شد.");
      await refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-peyda-bold">مدیریت نظرات</h1>
      {message && (
        <p role="status" className="text-green-600">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="text-red-500">
          {error}
        </p>
      )}
      <CommentForm
        key={formKey}
        busy={busy}
        initialValues={
          editing
            ? { ...editing, companyName: editing.companyName ?? "" }
            : undefined
        }
        onSave={save}
        onCancel={reset}
      />
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-peyda-bold">فهرست نظرات</h2>
        <Button
          type="button"
          variant="outline"
          disabled={busy || list.isFetching}
          onClick={() => void list.refetch()}
        >
          تازه‌سازی فهرست
        </Button>
      </div>
      {list.isPending && <p role="status">در حال دریافت نظرات…</p>}
      {list.isError && (
        <p role="alert">دریافت نظرات انجام نشد. دوباره فهرست را تازه کنید.</p>
      )}
      {list.data?.length === 0 && <p>هنوز نظری ثبت نشده است.</p>}
      <div className="grid gap-5 md:grid-cols-2">
        {list.data?.map((comment) => (
          <article key={comment.id} className="space-y-3">
            <CommentCard comment={comment} />
            <p className="text-sm text-muted-foreground">
              {comment.published ? "منتشرشده" : "پیش‌نویس"} · ترتیب{" "}
              {comment.sortOrder}
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setEditing(comment);
                  setFormKey((key) => key + 1);
                  setMessage("");
                  setError("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ویرایش
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={busy}
                onClick={() => void deleteComment(comment)}
              >
                حذف
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
