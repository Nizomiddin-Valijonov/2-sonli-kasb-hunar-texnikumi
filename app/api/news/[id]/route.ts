import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/server-utils";
import { verifyAdminSession } from "@/lib/auth";
import { readNews, writeNews, Language, NewsItem } from "@/lib/data";
import {
  sanitizeText,
  sanitizeImagePath,
  sanitizeLang,
  isValidDate,
} from "@/lib/validation";

const allowedLanguages: Language[] = ["uz", "en", "ru"];

function sanitizeNewsBody(payload: any): Partial<NewsItem> | null {
  const result: Partial<NewsItem> = {};

  if (payload?.title) {
    const title = sanitizeText(payload.title, 3, 250);
    if (!title) return null;
    result.title = title;
  }

  if (payload?.desc) {
    const desc = sanitizeText(payload.desc, 10, 1000);
    if (!desc) return null;
    result.desc = desc;
  }

  if (payload?.fullText) {
    const fullText = sanitizeText(payload.fullText, 10, 5000);
    if (!fullText) return null;
    result.fullText = fullText;
  }

  if (payload?.img) {
    const img = sanitizeImagePath(payload.img);
    if (!img) return null;
    result.img = img;
  }

  if (payload?.date) {
    const date = isValidDate(payload.date);
    if (!date) return null;
    result.date = date;
  }

  if (payload?.lang) {
    const lang = sanitizeLang(payload.lang);
    if (!lang) return null;
    result.lang = lang;
  }

  return Object.keys(result).length ? result : null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const allNews = await readNews();
  const item = allNews.find((entry) => entry.id === Number(params.id));
  if (!item) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ data: item });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const changes = sanitizeNewsBody(payload);
  if (!changes) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const allNews = await readNews();
  const index = allNews.findIndex((entry) => entry.id === Number(params.id));
  if (index === -1) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const updated = { ...allNews[index], ...changes };
  allNews[index] = updated;
  await writeNews(allNews);

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allNews = await readNews();
  const updated = allNews.filter((entry) => entry.id !== Number(params.id));
  if (updated.length === allNews.length) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await writeNews(updated);
  return NextResponse.json({ success: true });
}
