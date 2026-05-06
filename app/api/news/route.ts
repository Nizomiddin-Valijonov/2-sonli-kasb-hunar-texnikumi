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

function createNewsItem(
  payload: any,
  lang: Language,
  common: { img?: string; date?: string } = {},
): NewsItem | null {
  const title = sanitizeText(payload?.title, 3, 250);
  const desc = sanitizeText(payload?.desc, 10, 1000);
  const fullText = sanitizeText(payload?.fullText, 10, 5000);
  const img = sanitizeImagePath(payload?.img || common.img);
  const date =
    isValidDate(payload?.date || common.date) ||
    new Date().toISOString().slice(0, 10);

  if (!title || !desc || !fullText || !img) {
    return null;
  }

  return {
    id: 0,
    lang,
    title,
    desc,
    fullText,
    img,
    date,
  };
}

function sanitizeNewsBody(payload: any): NewsItem[] | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (payload.translations && typeof payload.translations === "object") {
    const translations = payload.translations;
    const items: NewsItem[] = [];
    const common = { img: payload?.img, date: payload?.date };

    for (const lang of allowedLanguages) {
      const translationData = translations[lang];
      if (!translationData || typeof translationData !== "object") {
        continue;
      }

      const item = createNewsItem(translationData, lang, common);
      if (!item) {
        return null;
      }
      items.push(item);
    }

    return items.length > 0 ? items : null;
  }

  const lang = sanitizeLang(payload?.lang) || "uz";
  const item = createNewsItem(payload, lang);
  return item ? [item] : null;
}

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang") || "all";
  const allNews = await readNews();
  const filtered =
    lang !== "all" ? allNews.filter((item) => item.lang === lang) : allNews;
  return NextResponse.json({ data: filtered });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const items = sanitizeNewsBody(payload);
  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "Invalid news payload." },
      { status: 400 },
    );
  }

  const allNews = await readNews();
  let nextId = allNews.reduce((max, entry) => Math.max(max, entry.id), 0) + 1;
  const created = items.map((item) => ({ ...item, id: nextId++ }));
  allNews.push(...created);
  await writeNews(allNews);

  return NextResponse.json({ data: created }, { status: 201 });
}
