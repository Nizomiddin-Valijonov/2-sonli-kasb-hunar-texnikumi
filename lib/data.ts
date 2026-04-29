import { readJson, writeJson } from "@/lib/storage";

export type Language = "uz" | "en" | "ru";

export interface NewsItem {
  id: number;
  lang: Language;
  title: string;
  desc: string;
  fullText: string;
  img: string;
  date: string;
}

export interface EmployeeItem {
  id: number;
  lang: Language;
  name: string;
  role: { uz: string; en: string; ru: string } | string;
  img: string;
  highlight?: boolean;
}

export interface TravelItem {
  id: number;
  lang: Language;
  title: string;
  description: string;
  img: string;
  order: number;
}

export interface AdminData {
  passwordHash: string;
  salt: string;
  sessions: string[];
}

export async function readNews(): Promise<NewsItem[]> {
  return readJson<NewsItem[]>("news.json", []);
}

export async function writeNews(news: NewsItem[]) {
  return writeJson("news.json", news);
}

export async function readEmployees(): Promise<EmployeeItem[]> {
  return readJson<EmployeeItem[]>("employees.json", []);
}

export async function writeEmployees(items: EmployeeItem[]) {
  return writeJson("employees.json", items);
}

export async function readTravel(): Promise<TravelItem[]> {
  return readJson<TravelItem[]>("travel360.json", []);
}

export async function writeTravel(items: TravelItem[]) {
  return writeJson("travel360.json", items);
}

export async function readAdminData(): Promise<AdminData> {
  return readJson<AdminData>("admin.json", {
    passwordHash: "",
    salt: "",
    sessions: [],
  });
}

export async function writeAdminData(data: AdminData) {
  return writeJson("admin.json", data);
}
