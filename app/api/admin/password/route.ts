import { NextRequest, NextResponse } from "next/server";
import { changeAdminPassword, revokeAdminSession, verifyAdminSession, createAdminSession } from "@/lib/auth";
import { ADMIN_COOKIE_NAME, createAdminCookieResponse, clearAdminCookieResponse } from "@/lib/server-utils";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = await verifyAdminSession(token);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json();
  const currentPassword = String(body?.currentPassword || "").trim();
  const newPassword = String(body?.newPassword || "").trim();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Current and new password are required." }, { status: 400 });
  }

  const changed = await changeAdminPassword(currentPassword, newPassword);
  if (!changed) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  await revokeAdminSession(token);
  const nextToken = await createAdminSession();
  return createAdminCookieResponse({ success: true }, nextToken);
}
