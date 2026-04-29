import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/server-utils";
import { verifyAdminSession } from "@/lib/auth";
import { readEmployees, writeEmployees, Language, EmployeeItem } from "@/lib/data";
import { sanitizeText, sanitizeImagePath, sanitizeLang } from "@/lib/validation";

const allowedLanguages: Language[] = ["uz", "en", "ru"];

function createEmployeeItem(payload: any, lang: Language): EmployeeItem | null {
  const name = sanitizeText(payload?.name, 2, 120);
  const img = sanitizeImagePath(payload?.img);
  const highlight = Boolean(payload?.highlight);

  const roleUz = sanitizeText(payload?.role?.uz || payload?.roleUz, 2, 120);
  const roleEn = sanitizeText(payload?.role?.en || payload?.roleEn, 2, 120);
  const roleRu = sanitizeText(payload?.role?.ru || payload?.roleRu, 2, 120);

  if (!name || !img || !roleUz || !roleEn || !roleRu) {
    return null;
  }

  return {
    id: 0,
    lang,
    name,
    role: { uz: roleUz, en: roleEn, ru: roleRu },
    img,
    highlight,
  };
}

function sanitizeEmployeeBody(payload: any): EmployeeItem[] | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (payload.translations && typeof payload.translations === "object") {
    const items: EmployeeItem[] = [];
    for (const lang of allowedLanguages) {
      const item = createEmployeeItem(payload, lang);
      if (!item) return null;
      items.push(item);
    }
    return items;
  }

  const createAllLanguages =
    payload?.role && typeof payload.role === "object" && !payload?.lang;

  if (createAllLanguages) {
    const items: EmployeeItem[] = [];
    for (const lang of allowedLanguages) {
      const item = createEmployeeItem(payload, lang);
      if (!item) return null;
      items.push(item);
    }
    return items;
  }

  const lang = sanitizeLang(payload?.lang) || "uz";
  const item = createEmployeeItem(payload, lang);
  return item ? [item] : null;
}

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang") || "all";
  const allEmployees = await readEmployees();
  const filtered = lang !== "all" ? allEmployees.filter((item) => item.lang === lang) : allEmployees;
  return NextResponse.json({ data: filtered });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const items = sanitizeEmployeeBody(payload);
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Invalid employee payload." }, { status: 400 });
  }

  const allEmployees = await readEmployees();
  let nextId = allEmployees.reduce((max, entry) => Math.max(max, entry.id), 0) + 1;
  const created = items.map((item) => ({ ...item, id: nextId++ }));
  allEmployees.push(...created);
  await writeEmployees(allEmployees);

  return NextResponse.json({ data: created }, { status: 201 });
}
