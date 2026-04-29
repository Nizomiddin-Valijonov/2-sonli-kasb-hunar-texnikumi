import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/server-utils";
import { verifyAdminSession } from "@/lib/auth";
import { readEmployees, writeEmployees, Language, EmployeeItem } from "@/lib/data";
import { sanitizeText, sanitizeImagePath, sanitizeLang } from "@/lib/validation";

const allowedLanguages: Language[] = ["uz", "en", "ru"];

function sanitizeEmployeeUpdates(payload: any): Partial<EmployeeItem> | null {
  const result: Partial<EmployeeItem> = {};

  if (payload?.name) {
    const name = sanitizeText(payload.name, 2, 120);
    if (!name) return null;
    result.name = name;
  }

  if (payload?.img) {
    const img = sanitizeImagePath(payload.img);
    if (!img) return null;
    result.img = img;
  }

  if (typeof payload?.highlight !== "undefined") {
    result.highlight = Boolean(payload.highlight);
  }

  if (payload?.lang) {
    const lang = sanitizeLang(payload.lang);
    if (!lang) return null;
    result.lang = lang;
  }

  if (typeof payload?.role !== "undefined") {
    if (typeof payload.role === "string") {
      const roleString = sanitizeText(payload.role, 2, 120);
      if (!roleString) return null;
      result.role = roleString;
    } else {
      const uz = sanitizeText(payload.role?.uz, 2, 120);
      const en = sanitizeText(payload.role?.en, 2, 120);
      const ru = sanitizeText(payload.role?.ru, 2, 120);
      if (!uz || !en || !ru) return null;
      result.role = { uz, en, ru };
    }
  }

  if (payload?.roleUz || payload?.roleEn || payload?.roleRu) {
    const uz = sanitizeText(payload.roleUz, 2, 120);
    const en = sanitizeText(payload.roleEn, 2, 120);
    const ru = sanitizeText(payload.roleRu, 2, 120);
    if (!uz || !en || !ru) return null;
    result.role = { uz, en, ru };
  }

  return Object.keys(result).length ? result : null;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const allEmployees = await readEmployees();
  const item = allEmployees.find((entry) => entry.id === Number(params.id));
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
  const updates = sanitizeEmployeeUpdates(payload);
  if (!updates) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const allEmployees = await readEmployees();
  const index = allEmployees.findIndex((entry) => entry.id === Number(params.id));
  if (index === -1) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  allEmployees[index] = { ...allEmployees[index], ...updates };
  await writeEmployees(allEmployees);

  return NextResponse.json({ data: allEmployees[index] });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allEmployees = await readEmployees();
  const remaining = allEmployees.filter((entry) => entry.id !== Number(params.id));
  if (remaining.length === allEmployees.length) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await writeEmployees(remaining);
  return NextResponse.json({ success: true });
}
