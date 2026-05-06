import { promises as fs } from "node:fs";
import path from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = new Set(["news", "employees", "travel360", "general"]);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

async function listDirectoryImages(type: string) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", type);
  try {
    const files = await fs.readdir(uploadDir);
    return files
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .map((file) => `/uploads/${type}/${file}`);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const queryType = String(req.nextUrl.searchParams.get("type") || "all").toLowerCase();

  try {
    if (queryType === "all") {
      const results = await Promise.all(
        Array.from(ALLOWED_TYPES).map((type) => listDirectoryImages(type)),
      );
      return NextResponse.json({ data: results.flat() });
    }

    const type = ALLOWED_TYPES.has(queryType) ? queryType : "news";
    const images = await listDirectoryImages(type);
    return NextResponse.json({ data: images });
  } catch (_error) {
    return NextResponse.json(
      { error: "Unable to read uploaded images." },
      { status: 500 },
    );
  }
}
