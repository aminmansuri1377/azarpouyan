import { loadEnvConfig } from "@next/env";
import {
  GetBucketCorsCommand,
  PutBucketCorsCommand,
  type CORSRule,
} from "@aws-sdk/client-s3";
import { journalS3 } from "../server/services/journal/storage";

async function main() {
  loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
  const args = process.argv.slice(2);
  const index = args.indexOf("--origins");
  if (index < 0 || !args[index + 1])
    throw new Error(
      "Usage: npx tsx scripts/configure-journal-cors.ts --origins http://localhost:3000,https://your-site.example",
    );
  const origins = args[index + 1].split(",").map((value) => {
    const text = value.trim();
    const url = new URL(text);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.origin !== text ||
      url.username ||
      url.password
    )
      throw new Error(
        "Origins must be exact http(s) origins without a path or trailing slash.",
      );
    return url.origin;
  });
  const { client, bucket } = journalS3();
  let rules: CORSRule[] = [];
  try {
    const previous = await client.send(
      new GetBucketCorsCommand({ Bucket: bucket }),
      { abortSignal: AbortSignal.timeout(20000) },
    );
    rules = previous.CORSRules || [];
  } catch (error) {
    if ((error as { name?: string }).name !== "NoSuchCORSConfiguration")
      throw error;
  }
  const own = rules.find((rule) => rule.ID === "azarpouyan-journal-upload");
  const rule: CORSRule = {
    ID: "azarpouyan-journal-upload",
    AllowedOrigins: [...new Set([...(own?.AllowedOrigins || []), ...origins])],
    AllowedMethods: ["PUT"],
    AllowedHeaders: ["content-type"],
    MaxAgeSeconds: 3600,
  };
  // Other applications' existing CORS rules are preserved.
  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [...rules.filter((item) => item.ID !== rule.ID), rule],
      },
    }),
    { abortSignal: AbortSignal.timeout(20000) },
  );
  console.log("Journal PUT CORS configured for:", rule.AllowedOrigins);
}
main().catch((error) => {
  const e = error as {
    name?: string;
    code?: string;
    $metadata?: { httpStatusCode?: number };
  };
  console.error("CORS configuration failed:", {
    name: e.name,
    code: e.code,
    status: e.$metadata?.httpStatusCode,
  });
  console.error(
    "Check endpoint connectivity, exact origins and GetBucketCors/PutBucketCors permissions. See docs/JOURNALS-TRPC.fa.md.",
  );
  process.exitCode = 1;
});
