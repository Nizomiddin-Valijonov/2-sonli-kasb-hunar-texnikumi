import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/server-utils";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = await verifyAdminSession(token);
  return NextResponse.json({ authenticated });
}
