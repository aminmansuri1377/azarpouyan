"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import {
  commentInput,
  COMMENT_IMAGE_MAX_BYTES,
  COMMENT_IMAGE_TYPES,
  type CommentValues,
} from "@/lib/comment-schema";

const emptyValues: CommentValues = {
  fullName: "",
  companyName: "",
  text: "",
  imageUrl: "",
  published: true,
  sortOrder: 0,
};
const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-background p-3 text-foreground";

type Props = {
  initialValues?: CommentValues;
  busy: boolean;
  onSave: (values: CommentValues) => Promise<void>;
  onCancel: () => void;
};

export default function CommentForm({
  initialValues,
  busy,
  onSave,
  onCancel,
}: Props) {
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const values = initialValues ?? emptyValues;
  const disabled = busy || uploading;

  async function uploadImage(file: File) {
    setError("");
    setUploading(true);
    try {
      if (!COMMENT_IMAGE_TYPES.includes(file.type))
        throw new Error("فرمت تصویر باید JPG، PNG، WebP یا GIF باشد.");
      if (!file.size || file.size > COMMENT_IMAGE_MAX_BYTES)
        throw new Error("تصویر باید حداکثر ۵ مگابایت باشد و خالی نباشد.");
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "comments");
      const response = await fetch("/api/upload", {
        method: "POST",
        body,
        signal: AbortSignal.timeout(120000),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "بارگذاری تصویر انجام نشد.");
      const parsed = commentInput.shape.imageUrl.safeParse(result.url);
      if (!parsed.success) throw new Error("آدرس تصویر دریافت‌شده معتبر نیست.");
      setImageUrl(parsed.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "بارگذاری تصویر انجام نشد.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const data: CommentValues = {
      fullName: String(form.get("fullName") ?? ""),
      companyName: String(form.get("companyName") ?? ""),
      text: String(form.get("text") ?? ""),
      imageUrl,
      published: form.get("published") === "on",
      sortOrder: Number(form.get("sortOrder")),
    };
    const parsed = commentInput.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    try {
      await onSave(data);
      if (!initialValues) {
        formElement.reset();
        setImageUrl("");
        setError("");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "ذخیره انجام نشد.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border bg-card p-5"
    >
      <fieldset disabled={disabled} className="space-y-4">
        <legend className="mb-4 text-lg font-peyda-bold">
          {initialValues ? "ویرایش نظر" : "افزودن نظر"}
        </legend>
        {error && (
          <p role="alert" className="text-red-500">
            {error}
          </p>
        )}
        <label className="block">
          عکس نظردهنده (حداکثر ۵ مگابایت)
          <input
            type="file"
            accept={COMMENT_IMAGE_TYPES.join(",")}
            className={inputClass}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (file) void uploadImage(file);
            }}
          />
        </label>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="تصویر نظردهنده"
            width={80}
            height={80}
            className="size-20 rounded-full object-cover"
          />
        )}
        {uploading && <p role="status">در حال بارگذاری تصویر…</p>}
        <label className="block">
          نام کامل
          <input
            name="fullName"
            required
            maxLength={150}
            defaultValue={values.fullName}
            className={inputClass}
          />
        </label>
        <label className="block">
          نام شرکت (اختیاری)
          <input
            name="companyName"
            maxLength={200}
            defaultValue={values.companyName}
            className={inputClass}
          />
        </label>
        <label className="block">
          متن نظر
          <textarea
            name="text"
            required
            maxLength={5000}
            rows={5}
            defaultValue={values.text}
            className={inputClass}
          />
        </label>
        <label className="block">
          ترتیب نمایش (عدد کوچک‌تر بالاتر)
          <input
            name="sortOrder"
            type="number"
            required
            min={0}
            max={1000000}
            step={1}
            defaultValue={values.sortOrder}
            className={inputClass}
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            name="published"
            type="checkbox"
            defaultChecked={values.published}
          />
          انتشار در سایت
        </label>
        <div className="flex gap-3">
          <Button type="submit" disabled={disabled || !imageUrl}>
            {busy ? "در حال ذخیره…" : "ذخیره نظر"}
          </Button>
          {initialValues && (
            <Button type="button" variant="outline" onClick={onCancel}>
              انصراف از ویرایش
            </Button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
