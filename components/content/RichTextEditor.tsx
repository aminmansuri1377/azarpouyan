"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded border px-2 py-1 text-sm transition ${
        active
          ? "bg-primary text-white"
          : "bg-white text-gray-700 hover:bg-gray-100"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "متن مقاله را وارد کنید...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
      }),

      Table.configure({
        resizable: true,
      }),

      TableRow,
      TableHeader,
      TableCell,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    // placeholder را به عنوان محتوای واقعی ذخیره نمی‌کنیم
    content: value || "<p></p>",

    editorProps: {
      attributes: {
        class: "tiptap-editor-content min-h-[350px] outline-none",
        dir: "rtl",
      },
    },

    onUpdate({ editor }) {
      const html = editor.getHTML();

      // مقدار جدید را به react-hook-form می‌فرستیم
      onChange(html);
    },
  });

  /**
   * مقداردهی اولیه و هماهنگ‌کردن ادیتور با فرم
   *
   * نکته مهم:
   * اگر value خالی شد، محتوای فعلی را پاک نمی‌کنیم.
   * چون ممکن است react-hook-form هنگام رندر مجدد
   * برای لحظه‌ای مقدار خالی ارسال کند.
   */
  useEffect(() => {
    if (!editor) return;

    // وقتی کاربر در حال تایپ است، محتوای ادیتور را overwrite نکن
    if (editor.isFocused) {
      return;
    }

    const currentHtml = editor.getHTML();

    // مقدار خالی موقت نباید باعث حذف محتوا شود
    if (!value) {
      return;
    }

    // اگر مقدار فعلی و فرم یکی هستند، کاری انجام نده
    if (value === currentHtml) {
      return;
    }

    // فقط وقتی مقدار جدید از بیرون آمد، ادیتور را تغییر بده
    editor.commands.setContent(value, false);
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-lg border p-4 text-gray-500">
        در حال بارگذاری ویرایشگر...
      </div>
    );
  }

  const addLink = () => {
    const currentUrl = editor.getAttributes("link").href;

    const url = window.prompt(
      "آدرس لینک را وارد کنید",
      currentUrl || "https://",
    );

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImageByUrl = () => {
    const url = window.prompt("آدرس تصویر را وارد کنید");

    if (!url) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: url,
      })
      .run();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 60_000);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", "content");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      let data: {
        url?: string;
        error?: string;
      };

      try {
        data = await response.json();
      } catch {
        throw new Error("پاسخ نامعتبر از سرور آپلود دریافت شد");
      }

      if (!response.ok) {
        throw new Error(data.error || "آپلود تصویر ناموفق بود");
      }

      if (!data.url) {
        throw new Error("آدرس تصویر از سرور دریافت نشد");
      }

      /**
       * تصویر دقیقاً در محل فعلی cursor قرار می‌گیرد.
       */
      editor
        .chain()
        .focus()
        .setImage({
          src: data.url,
          alt: file.name,
          title: file.name,
        })
        .run();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setUploadError(
          "زمان آپلود تمام شد. اتصال اینترنت یا API آپلود را بررسی کنید.",
        );
      } else {
        setUploadError(
          error instanceof Error ? error.message : "خطا در آپلود تصویر",
        );
      }
    } finally {
      window.clearTimeout(timeoutId);
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    uploadImage(file);
  };

  const isInsideTable = editor.isActive("table");

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
      {/* ابزارهای اصلی */}
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-2" dir="rtl">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          تیتر ۲
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
        >
          تیتر ۳
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          active={editor.isActive("heading", { level: 4 })}
        >
          تیتر ۴
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          ضخیم
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          کج
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          لیست
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          لیست شماره‌دار
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          نقل‌قول
        </ToolbarButton>

        <ToolbarButton onClick={addLink} active={editor.isActive("link")}>
          لینک
        </ToolbarButton>

        <ToolbarButton onClick={addImageByUrl}>تصویر با URL</ToolbarButton>

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "در حال آپلود..." : "آپلود تصویر"}
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run()
          }
        >
          درج جدول
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          راست‌چین
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          وسط‌چین
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          چپ‌چین
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          بازگشت
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          تکرار
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>

      {/* ابزارهای جدول */}
      {isInsideTable && (
        <div
          className="flex flex-wrap gap-2 border-b bg-yellow-50 p-2"
          dir="rtl"
        >
          <span className="flex items-center px-2 text-sm font-bold">
            مدیریت جدول:
          </span>

          <ToolbarButton
            onClick={() => editor.chain().focus().addRowBefore().run()}
            disabled={!editor.can().addRowBefore()}
          >
            افزودن ردیف بالا
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.can().addRowAfter()}
          >
            افزودن ردیف پایین
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.can().deleteRow()}
          >
            حذف ردیف
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            disabled={!editor.can().addColumnBefore()}
          >
            افزودن ستون راست
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.can().addColumnAfter()}
          >
            افزودن ستون چپ
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.can().deleteColumn()}
          >
            حذف ستون
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              const confirmed = window.confirm(
                "آیا از حذف کامل جدول مطمئن هستید؟",
              );

              if (confirmed) {
                editor.chain().focus().deleteTable().run();
              }
            }}
            disabled={!editor.can().deleteTable()}
          >
            حذف کامل جدول
          </ToolbarButton>
        </div>
      )}

      {/* خطای آپلود */}
      {uploadError && (
        <div className="border-b bg-red-50 px-4 py-2 text-right text-sm text-red-600">
          {uploadError}
        </div>
      )}

      {/* محتوای ادیتور */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
