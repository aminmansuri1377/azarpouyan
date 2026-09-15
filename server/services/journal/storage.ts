import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { Readable } from "node:stream";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sharp from "sharp";
import { JOURNAL_COVER_MAX_MIB } from "@/lib/journal-upload-limits";

export const fileInput = z.object({
  size: z.number().int().positive(),
  type: z.string(),
});
export type UploadFileInput = z.infer<typeof fileInput>;
const receiptSchema = z.object({
  target: z.string(),
  key: z.string(),
  kind: z.literal("cover"),
  size: z.number().int().positive(),
  type: z.string(),
  expires: z.number(),
});
type Receipt = z.infer<typeof receiptSchema>;
const bad = (message: string) =>
  new TRPCError({ code: "BAD_REQUEST", message });

export function journalStorageConfig() {
  const endpoint = process.env.S3_ENDPOINT?.trim();
  if (
    !endpoint ||
    !process.env.S3_BUCKET ||
    !process.env.S3_ACCESS_KEY ||
    !process.env.S3_SECRET_KEY
  )
    throw bad(
      "متغیرهای S3_ENDPOINT، S3_BUCKET، S3_ACCESS_KEY و S3_SECRET_KEY در محیط اجرای Next.js کامل نیستند.",
    );
  let url: URL;
  try {
    url = new URL(
      /^https?:\/\//i.test(endpoint) ? endpoint : `https://${endpoint}`,
    );
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error();
  } catch {
    throw bad(
      "S3_ENDPOINT معتبر نیست؛ endpoint بخش دسترسی SDK باکت را وارد کنید.",
    );
  }
  return {
    endpoint: url.toString(),
    bucket: process.env.S3_BUCKET.trim(),
    region: process.env.S3_REGION || "default",
  };
}
let client: S3Client | undefined;
export function journalS3() {
  const config = journalStorageConfig();
  client ??= new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: true,
    maxAttempts: 1,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    requestHandler: {
      connectionTimeout: 8000,
      socketTimeout: 15000,
      requestTimeout: 20000,
      throwOnRequestTimeout: true,
    },
  });
  return { client, ...config };
}

export function storageFailure(error: unknown, stage: string): TRPCError {
  if (error instanceof TRPCError) return error;
  const e = error as {
    name?: string;
    code?: string;
    cause?: { code?: string };
    $metadata?: { httpStatusCode?: number };
  };
  const code = e?.code || e?.cause?.code || e?.name || "UnknownError";
  const status = e?.$metadata?.httpStatusCode;
  console.error("[journal] storage failure", { stage, code, status });
  return new TRPCError({
    code: "BAD_GATEWAY",
    message: `مرحله ${stage} در لیارا انجام نشد (${code}${status ? ` / ${status}` : ""}). اتصال و تنظیمات S3 محیط اجرای Next.js را بررسی کنید.`,
  });
}
function secret() {
  if (!process.env.ADMIN_SESSION_SECRET)
    throw bad("ADMIN_SESSION_SECRET تنظیم نشده است.");
  return process.env.ADMIN_SESSION_SECRET;
}
function signReceipt(value: Receipt) {
  const data = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${data}.${createHmac("sha256", secret()).update(data).digest("base64url")}`;
}
export function readReceipt(
  token: string,
  target: string,
  kind: Receipt["kind"],
) {
  const [data, signature, extra] = token.split(".");
  if (!data || !signature || extra) throw bad("رسید آپلود معتبر نیست.");
  const expected = createHmac("sha256", secret()).update(data).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw bad("رسید آپلود معتبر نیست.");
  let receipt: Receipt;
  try {
    receipt = receiptSchema.parse(
      JSON.parse(Buffer.from(data, "base64url").toString()),
    );
  } catch {
    throw bad("رسید آپلود معتبر نیست.");
  }
  if (
    receipt.target !== target ||
    receipt.kind !== kind ||
    receipt.expires < Date.now()
  )
    throw bad(
      "رسید آپلود منقضی شده یا متعلق به این گاهنامه نیست؛ فایل را دوباره ارسال کنید.",
    );
  return receipt;
}

export async function prepareDirectUpload(
  target: string,
  kind: Receipt["kind"],
  file: UploadFileInput,
) {
  const max = JOURNAL_COVER_MAX_MIB * 1024 * 1024;
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  if (file.size > max || !Object.hasOwn(extensions, file.type))
    throw bad("حجم یا نوع تصویر جلد مجاز نیست.");
  const { client, bucket } = journalS3();
  const receipt: Receipt = {
    ...file,
    target,
    kind,
    key: `journals/${kind}/${randomUUID()}.${extensions[file.type]}`,
    expires: Date.now() + 2 * 60 * 60 * 1000,
  };
  const token = signReceipt(receipt);
  // Signing is local: the large body never passes through Next.js or tRPC.
  const url = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: receipt.key,
      ContentType: file.type,
    }),
    { expiresIn: 3600, signableHeaders: new Set(["content-type"]) },
  );
  return { url, token, contentType: file.type };
}

async function readBytes(key: string, limit: number, range?: string) {
  const { client, bucket } = journalS3();
  const object = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key, Range: range }),
    { abortSignal: AbortSignal.timeout(20000) },
  );
  if (!object.Body) throw bad("فایل بارگذاری‌شده قابل خواندن نیست.");
  const stream = object.Body as Readable;
  const timer = setTimeout(
    () => stream.destroy(new Error("ReadTimeout")),
    20000,
  );
  try {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of stream) {
      const bytes = Buffer.from(chunk);
      size += bytes.length;
      if (size > limit)
        throw bad("حجم فایل دریافتی با مقدار مجاز تطابق ندارد.");
      chunks.push(bytes);
    }
    return Buffer.concat(chunks);
  } finally {
    clearTimeout(timer);
    stream.destroy();
  }
}
export async function verifyUploadedFile(
  token: string,
  target: string,
  kind: Receipt["kind"],
) {
  const receipt = readReceipt(token, target, kind);
  try {
    const { client, bucket } = journalS3();
    const head = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: receipt.key }),
      { abortSignal: AbortSignal.timeout(20000) },
    );
    if (
      head.ContentLength !== receipt.size ||
      head.ContentType !== receipt.type
    )
      throw bad("حجم یا نوع فایل ذخیره‌شده با فرم مطابقت ندارد.");
    const bytes = await readBytes(
      receipt.key,
      JOURNAL_COVER_MAX_MIB * 1024 * 1024,
    );
    try {
      const metadata = await sharp(bytes, {
        limitInputPixels: 40000000,
      }).metadata();
      if (
        !metadata.width ||
        !metadata.height ||
        metadata.width * metadata.height > 40000000 ||
        !["jpeg", "png", "webp"].includes(metadata.format || "")
      )
        throw new Error();
    } catch {
      throw bad("تصویر جلد معتبر نیست.");
    }
    return receipt;
  } catch (error) {
    throw storageFailure(error, `verify-${kind}`);
  }
}
export async function cleanupFiles(keys: string[]) {
  await Promise.all(
    keys.map(async (key) => {
      if (!key.startsWith("journals/")) return;
      try {
        const { client, bucket } = journalS3();
        await client.send(
          new DeleteObjectCommand({ Bucket: bucket, Key: key }),
          { abortSignal: AbortSignal.timeout(10000) },
        );
      } catch {
        console.error("[journal] unreferenced file; remove manually", { key });
      }
    }),
  );
}
