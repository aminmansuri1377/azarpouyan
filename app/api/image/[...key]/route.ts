// app/api/image/[...key]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET } from "@/lib/s3";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  try {
    const { key: keyParts } = await params;
    const key = keyParts.join("/");

    const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
    const response = await s3Client.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: "فایل پیدا نشد" }, { status: 404 });
    }

    const bytes = await response.Body.transformToByteArray();

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ error: "فایل یافت نشد" }, { status: 404 });
    }
    console.error("Image fetch error:", err);
    return NextResponse.json({ error: "خطا در دریافت فایل" }, { status: 500 });
  }
}
