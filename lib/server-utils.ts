import { NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "adminToken";

export function createAdminCookieResponse(body: unknown, token: string) {
  const response = NextResponse.json(body);
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}

export function clearAdminCookieResponse(body: unknown) {
  const response = NextResponse.json(body);
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
