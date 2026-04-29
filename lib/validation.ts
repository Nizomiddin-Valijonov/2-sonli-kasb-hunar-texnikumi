import { Language } from "@/lib/data";

const IMAGE_PATH_REGEX = /^\/?[a-zA-Z0-9_\-./]+$/;

export function sanitizeText(value: unknown, minLength = 1, maxLength = 2000): string | undefined {
  const text = typeof value === "string" ? value.trim() : String(value || "").trim();
  if (!text || text.length < minLength || text.length > maxLength) {
    return undefined;
  }
  return text;
}

export function sanitizeImagePath(value: unknown): string | undefined {
  const path = typeof value === "string" ? value.trim() : String(value || "").trim();
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return undefined;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!IMAGE_PATH_REGEX.test(normalized)) {
    return undefined;
  }
  return normalized;
}

export function sanitizeLang(value: unknown): Language | undefined {
  const lang = typeof value === "string" ? value.trim().toLowerCase() : String(value || "").trim().toLowerCase();
  if (lang === "uz" || lang === "en" || lang === "ru") {
    return lang;
  }
  return undefined;
}

export function isValidDate(value: unknown): string | undefined {
  const dateString = typeof value === "string" ? value.trim() : String(value || "").trim();
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString().slice(0, 10);
}
