"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface MultiImageUploaderProps {
  value: string[]; // آرایه‌ی URL های فعلی
  onChange: (urls: string[]) => void;
  folder: string; // مثلا "products"
  label?: string;
  maxFiles?: number; // سقف تعداد عکس (اختیاری)
}

export function MultiImageUploader({
  value,
  onChange,
  folder,
  label = "گالری تصاویر",
  maxFiles,
}: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (maxFiles && value.length + files.length > maxFiles) {
      setError(`حداکثر ${maxFiles} تصویر مجاز است`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // آپلود همه‌ی فایل‌ها به‌صورت موازی
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || `خطا در آپلود ${file.name}`);
          }

          return data.url as string;
        }),
      );

      onChange([...value, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در آپلود تصاویر");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div>
      <label>{label}</label>
      <br />

      {value.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 12,
            marginTop: 8,
          }}
        >
          {value.map((url, index) => (
            <div
              key={url + index}
              style={{
                position: "relative",
                width: 100,
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 6,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 88,
                  height: 88,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={url}
                  alt={`gallery-${index}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 4,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  title="جابه‌جایی به چپ"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === value.length - 1}
                  title="جابه‌جایی به راست"
                >
                  ▶
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                style={{
                  marginTop: 4,
                  width: "100%",
                  color: "red",
                  fontSize: 12,
                }}
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFilesSelect}
        disabled={isUploading || (maxFiles ? value.length >= maxFiles : false)}
      />

      {isUploading && <p>در حال آپلود...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
