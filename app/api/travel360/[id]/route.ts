import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/server-utils";
import { verifyAdminSession } from "@/lib/auth";
import { readTravel, writeTravel, TravelItem } from "@/lib/data";
import { sanitizeText, sanitizeImagePath, sanitizeLang } from "@/lib/validation";

function sanitizeTravelUpdates(payload: any): Partial<TravelItem> | null {
  const result: Partial<TravelItem> = {};

  if (payload?.title) {
    const title = sanitizeText(payload.title, 3, 180);
    if (!title) return null;
    result.title = title;
  }

  if (payload?.description) {
    const description = sanitizeText(payload.description, 10, 1000);
    if (!description) return null;
    result.description = description;
  }

  if (payload?.img) {
    const img = sanitizeImagePath(payload.img);
    if (!img) return null;
    result.img = img;
  }

  if (typeof payload?.order !== "undefined") {
    const order = Number(payload.order) || 0;
    if (order < 1) return null;
    result.order = order;
  }

  if (payload?.lang) {
    const lang = sanitizeLang(payload.lang);
    if (!lang) return null;
    result.lang = lang;
  }

  return Object.keys(result).length ? result : null;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const travel = await readTravel();
  const item = travel.find((entry) => entry.id === Number(params.id));
  if (!item) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ data: item });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const updates = sanitizeTravelUpdates(payload);
  if (!updates) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const travel = await readTravel();
  const index = travel.findIndex((entry) => entry.id === Number(params.id));
  if (index === -1) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  travel[index] = { ...travel[index], ...updates };
  await writeTravel(travel);
  return NextResponse.json({ data: travel[index] });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const travel = await readTravel();
  const filtered = travel.filter((entry) => entry.id !== Number(params.id));
  if (filtered.length === travel.length) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await writeTravel(filtered);
  return NextResponse.json({ success: true });
}
