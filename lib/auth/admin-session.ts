import crypto from "crypto";

const COOKIE_NAME = "admin_session";

export function createAdminToken() {
  const secret = process.env.ADMIN_SESSION_SECRET!;

  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
  });

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const token = Buffer.from(
    JSON.stringify({
      payload,
      signature,
    }),
  ).toString("base64");

  return token;
}

export function verifyAdminToken(token: string) {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET!;

    const decoded = JSON.parse(Buffer.from(token, "base64").toString());

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(decoded.payload)
      .digest("hex");

    if (expectedSignature !== decoded.signature) {
      return false;
    }

    const payload = JSON.parse(decoded.payload);

    if (payload.exp < Date.now()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
