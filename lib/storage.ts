import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export async function ensureDataDirectory() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  await ensureDataDirectory();
  const filePath = path.join(DATA_DIR, fileName);

  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "ENOENT") {
      await writeJson(fileName, fallback);
      return fallback;
    }
    throw error;
  }
}

export async function writeJson(fileName: string, value: unknown) {
  await ensureDataDirectory();
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}
