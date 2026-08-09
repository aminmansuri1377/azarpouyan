// components/ui/ImageUploader.tsx
"use client";

import { useRef, useState } from "react";

interface ImageUploaderProps {
  value: string; // URL فعلی عکس
  onChange: (url: string) => void;
  folder: string; // مثلا "categories" یا "products"
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder,
  label = "تصویر",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "خطا در آپلود");
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در آپلود فایل");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div>
      <label>{label}</label>
      <br />

      {value && (
        <div style={{ marginBottom: 8 }}>
          <img
            src={value}
            alt="preview"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
          <br />
          <button type="button" onClick={handleRemove}>
            حذف تصویر
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {isUploading && <p>در حال آپلود...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
