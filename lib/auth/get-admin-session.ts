import { cookies } from "next/headers";

import { ADMIN_COOKIE_NAME, verifyAdminToken } from "./admin-session";

export async function getAdminSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return verifyAdminToken(token);
}
