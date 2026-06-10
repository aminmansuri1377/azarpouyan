import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME } from "@/lib/auth/admin-session";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
