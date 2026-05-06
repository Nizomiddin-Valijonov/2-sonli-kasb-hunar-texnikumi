import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, verifyAdminLogin } from "@/lib/auth";
import {
  ADMIN_COOKIE_NAME,
  createAdminCookieResponse,
} from "@/lib/server-utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "").trim();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  const isValid = await verifyAdminLogin(username, password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 },
    );
  }

  const token = await createAdminSession();
  return createAdminCookieResponse({ success: true, username }, token);
}
