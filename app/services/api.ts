import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getEmployees = (lang: string) =>
  api.get(`/api/employees?lang=${lang}`);

export const getNews = (lang: string) => api.get(`/api/news?lang=${lang}`);

export const getNewsById = (id: string) => api.get(`/api/news/${id}`);

export const getImageUrl = (path?: string | null, type?: "employees" | "news") => {
  if (!path) return null;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) return normalized;
  return normalized;
};

export default api;
