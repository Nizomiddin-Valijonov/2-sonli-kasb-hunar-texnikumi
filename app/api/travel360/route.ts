import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/server-utils";
import { verifyAdminSession } from "@/lib/auth";
import { readTravel, writeTravel, Language, TravelItem } from "@/lib/data";
import {
  sanitizeText,
  sanitizeImagePath,
  sanitizeLang,
} from "@/lib/validation";

const allowedLanguages: Language[] = ["uz", "en", "ru"];

function createTravelItem(
  payload: any,
  lang: Language,
  common: { img?: string; order?: number } = {},
): TravelItem | null {
  const title = sanitizeText(payload?.title, 3, 180);
  const description = sanitizeText(payload?.description, 10, 1000);
  const img = sanitizeImagePath(payload?.img || common.img);
  const order = Number(payload?.order ?? common.order ?? 0) || 0;

  if (!title || !description || !img || order < 1) {
    return null;
  }

  return {
    id: 0,
    lang,
    title,
    description,
    img,
    order,
  };
}

function sanitizeTravelBody(payload: any): TravelItem[] | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (payload.translations && typeof payload.translations === "object") {
    const items: TravelItem[] = [];
    const common = {
      img: payload?.img,
      order: Number(payload?.order ?? 0) || 0,
    };
    for (const lang of allowedLanguages) {
      const item = createTravelItem(payload.translations[lang], lang, common);
      if (!item) return null;
      items.push(item);
    }
    return items;
  }

  const lang = sanitizeLang(payload?.lang) || "uz";
  const item = createTravelItem(payload, lang);
  return item ? [item] : null;
}

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang") || "all";
  const travel = await readTravel();
  const filtered =
    lang !== "all" ? travel.filter((item) => item.lang === lang) : travel;
  const sorted = [...filtered].sort((a, b) => a.order - b.order);
  return NextResponse.json({ data: sorted });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const items = sanitizeTravelBody(payload);
  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "Invalid travel payload." },
      { status: 400 },
    );
  }

  const travel = await readTravel();
  let nextId = travel.reduce((max, entry) => Math.max(max, entry.id), 0) + 1;
  const created = items.map((item) => ({ ...item, id: nextId++ }));
  travel.push(...created);
  await writeTravel(travel);

  return NextResponse.json({ data: created }, { status: 201 });
}
