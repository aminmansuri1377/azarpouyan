import { NextResponse } from "next/server";

import { createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth/admin-session";

export async function POST(request: Request) {
  const body = await request.json();

  const password = body.password;

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 401,
      },
    );
  }

  const token = createAdminToken();

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
