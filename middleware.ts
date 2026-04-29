// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const supported = ["uz", "en", "ru"];

  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!supported.some((lng) => pathname.startsWith(`/${lng}`))) {
    return NextResponse.redirect(new URL(`/uz${pathname}`, req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
