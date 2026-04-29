import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ALLOWED_TYPES = new Set(["news", "employees", "travel360", "general"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function sanitizeFileName(filename: string) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+|[.-]+$/g, "")
    .slice(0, 120);
}

export async function POST(req: NextRequest) {
  const typeParam = String(req.nextUrl.searchParams.get("type") || "general").toLowerCase();
  const uploadType = ALLOWED_TYPES.has(typeParam) ? typeParam : "general";

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const originalName = file.name || "upload";
  const extension = path.extname(originalName).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json(
      { error: "Invalid file type. Use JPG, PNG, WEBP, GIF, or AVIF." },
      { status: 400 },
    );
  }

  const fileName = sanitizeFileName(originalName) || `upload${extension}`;
  const timestamp = Date.now();
  const finalName = `${timestamp}-${fileName}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", uploadType);
  const filePath = path.join(uploadDir, finalName);

  await fs.mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ path: `/uploads/${uploadType}/${finalName}` });
}
