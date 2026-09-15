export type JournalUploadProgress = {
  phase: "preparing" | "uploading" | "waiting" | "saving";
  loaded: number;
  total: number | null;
  retryMessage?: string;
};

type RetryNotice = { attempt: number; maxAttempts: number; delayMs: number; code: string };
class StorageUploadError extends Error {
  constructor(message: string, public retryable: boolean, public storageCode: string, public retryAfterMs = 0) { super(message); }
}

function responseError(xhr: XMLHttpRequest) {
  // Only retain bounded identifiers, never signed URLs or arbitrary server HTML.
  const code = /<Code>\s*([A-Za-z0-9_-]{1,80})\s*<\/Code>/i.exec(xhr.responseText)?.[1] || `HTTP_${xhr.status}`;
  const requestId = /<RequestId>\s*([A-Za-z0-9_-]{1,160})\s*<\/RequestId>/i.exec(xhr.responseText)?.[1];
  const reference = requestId ? ` شناسه پیگیری: ${requestId}` : "";
  const retryable = [429, 500, 502, 503, 504].includes(xhr.status);
  let message: string;
  if (code === "SlowDownWrite" || code === "SlowDown") {
    message = `فضای ذخیره‌سازی لیارا فعلاً نوشتن فایل را نمی‌پذیرد (${code} / HTTP ${xhr.status}). اگر پس از تلاش مجدد ادامه داشت، این خطا را به پشتیبانی لیارا گزارش کنید.${reference}`;
  } else if (retryable) {
    message = `خطای موقت سرویس ذخیره‌سازی لیارا (${code} / HTTP ${xhr.status}).${reference}`;
  } else if (xhr.status === 401 || xhr.status === 403) {
    message = `لیارا دسترسی آپلود را رد کرد (${code} / HTTP ${xhr.status}). مجوز کلید، ساعت سیستم و اعتبار لینک را بررسی کنید.${reference}`;
  } else {
    message = `ارسال فایل به لیارا انجام نشد (${code} / HTTP ${xhr.status}).${reference}`;
  }
  const retryAfter = xhr.getResponseHeader("Retry-After");
  const parsed = retryAfter ? (/^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - Date.now()) : 0;
  return new StorageUploadError(message, retryable, code, Number.isFinite(parsed) ? Math.max(0, parsed) : 0);
}

function sendOnce(url: string, file: File, contentType: string, onProgress: (loaded: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = event => onProgress(Math.min(event.loaded, file.size));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) { onProgress(file.size); resolve(); return; }
      reject(responseError(xhr));
    };
    xhr.onerror = () => reject(new Error("مرورگر نتوانست فایل را به لیارا ارسال کند. اتصال و CORS را بررسی کنید؛ جزئیات در Console مرورگر است."));
    xhr.ontimeout = () => reject(new Error("مهلت آپلود مستقیم به لیارا تمام شد؛ فایل را دوباره ارسال کنید."));
    xhr.onabort = () => reject(new Error("آپلود لغو شد."));
    xhr.open("PUT", url);
    xhr.timeout = 30 * 60 * 1000;
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.send(file);
  });
}

// At most three sequential attempts to the SAME signed key. No parallel retry,
// no duplicate journal/object, and no automatic retry of auth/CORS failures.
export async function uploadJournalFileDirect(
  url: string,
  file: File,
  contentType: string,
  onProgress: (loaded: number) => void,
  onRetry?: (notice: RetryNotice) => void,
): Promise<void> {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    onProgress(0);
    try { await sendOnce(url, file, contentType, onProgress); return; }
    catch (error) {
      if (!(error instanceof StorageUploadError) || !error.retryable || attempt === maxAttempts) throw error;
      const delayMs = Math.max(5000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 2000), error.retryAfterMs);
      // Do not disregard a provider asking for a longer cooldown, or block the
      // form for an arbitrary duration. Surface the error for manual follow-up.
      if (delayMs > 60000) throw error;
      onRetry?.({ attempt: attempt + 1, maxAttempts, delayMs, code: error.storageCode });
      await new Promise<void>(resolve => setTimeout(resolve, delayMs));
    }
  }
}
