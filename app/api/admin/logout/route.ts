import { NextRequest } from "next/server";
import { revokeAdminSession } from "@/lib/auth";
import { ADMIN_COOKIE_NAME, clearAdminCookieResponse } from "@/lib/server-utils";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  await revokeAdminSession(token);
  return clearAdminCookieResponse({ success: true });
}
