import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.nam-school84.uz";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getEmployees = (lang: string) =>
  api.get(`/api/employees?lang=${lang}`);

export const getNews = (lang: string) => api.get(`/api/news?lang=${lang}`);

export const getNewsById = (id: string) => api.get(`/api/news/${id}`);

export const getImageUrl = (path: string, type: "employees" | "news") =>
  path ? `${API_BASE_URL}/api/${type}${path}` : null;

export default api;
