"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/app/i18n";

interface NewsForm {
  titleUz: string;
  titleEn: string;
  titleRu: string;
  descUz: string;
  descEn: string;
  descRu: string;
  fullTextUz: string;
  fullTextEn: string;
  fullTextRu: string;
  img: string;
  date: string;
  lang: string;
}

interface EmployeeForm {
  name: string;
  img: string;
  lang: string;
  highlight: boolean;
  roleUz: string;
  roleEn: string;
  roleRu: string;
}

interface TravelForm {
  titleUz: string;
  titleEn: string;
  titleRu: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  img: string;
  order: number;
  lang: string;
}

interface NewsItem {
  id: number;
  title: string;
  desc: string;
  fullText: string;
  img: string;
  date: string;
  lang: string;
}

interface EmployeeItem {
  id: number;
  name: string;
  img: string;
  lang: string;
  highlight?: boolean;
  role: { uz: string; en: string; ru: string } | string;
}

interface TravelItem {
  id: number;
  title: string;
  description: string;
  img: string;
  order: number;
  lang: "uz" | "en" | "ru";
}

const defaultNewsForm: NewsForm = {
  titleUz: "",
  titleEn: "",
  titleRu: "",
  descUz: "",
  descEn: "",
  descRu: "",
  fullTextUz: "",
  fullTextEn: "",
  fullTextRu: "",
  img: "",
  date: new Date().toISOString().slice(0, 10),
  lang: "uz",
};

const defaultEmployeeForm: EmployeeForm = {
  name: "",
  img: "",
  lang: "uz",
  highlight: false,
  roleUz: "",
  roleEn: "",
  roleRu: "",
};

const defaultTravelForm: TravelForm = {
  titleUz: "",
  titleEn: "",
  titleRu: "",
  descriptionUz: "",
  descriptionEn: "",
  descriptionRu: "",
  img: "",
  order: 1,
  lang: "uz",
};

type AdminTab = "news" | "employees" | "travel360" | "password";
type UploadType = "news" | "employees" | "travel360";

const normalizeUploadPath = (value: string) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

async function fetchJson<T = unknown>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `Request failed: ${response.status}`);
  }
  return data as T;
}

async function parseApiResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? (JSON.parse(text) as any) : null;
  } catch {
    return { error: text || `Unexpected response format: ${response.statusText}` };
  }
}

interface ImageFieldProps {
  label: string;
  value: string;
  placeholder: string;
  uploading: boolean;
  status: string | null;
  images: string[];
  onFileUpload: (file: File) => Promise<void>;
  onPathChange: (value: string) => void;
  onSelectImage: (value: string) => void;
}

function ImageField({
  label,
  value,
  placeholder,
  uploading,
  status,
  images,
  onFileUpload,
  onPathChange,
  onSelectImage,
}: ImageFieldProps) {
  const previewSrc = normalizeUploadPath(value);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm text-slate-700">{label}</span>
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            await onFileUpload(file);
            event.target.value = "";
          }}
          disabled={uploading}
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white"
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-700">Image path</span>
        <input
          value={value}
          onChange={(event) => onPathChange(event.target.value)}
          placeholder={placeholder}
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
        />
      </label>
      {status ? <p className="text-sm text-slate-500">{status}</p> : null}
      {images.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm text-slate-700">Uploaded images</div>
          <div className="grid grid-cols-2 gap-2">
            {images.slice(0, 6).map((item) => {
              const imagePath = String(item);
              return (
                <button
                  key={imagePath}
                  type="button"
                  onClick={() => onSelectImage(imagePath)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100"
                >
                  {imagePath.replace("/uploads/", "")}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {previewSrc ? (
        <div className="relative h-40 rounded-3xl overflow-hidden border border-slate-200">
          <Image
            src={previewSrc}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}

export default function AdminPanel() {
  const { t, i18n } = useTranslation();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<
    "news" | "employees" | "travel360" | "password"
  >("news");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [newsForm, setNewsForm] = useState<NewsForm>(defaultNewsForm);
  const [employeeForm, setEmployeeForm] =
    useState<EmployeeForm>(defaultEmployeeForm);
  const [travelForm, setTravelForm] = useState<TravelForm>(defaultTravelForm);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [editNewsId, setEditNewsId] = useState<number | null>(null);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [editTravelId, setEditTravelId] = useState<number | null>(null);
  const [imageLibrary, setImageLibrary] = useState<string[]>([]);
  const [imageLibraryError, setImageLibraryError] = useState<string | null>(null);

  const isAdminReady = useMemo(() => authenticated !== null, [authenticated]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session", {
          credentials: "include",
        });
        const data = await response.json();
        setAuthenticated(Boolean(data?.authenticated));
      } catch {
        setAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [newsRes, employeesRes, travelRes] = await Promise.all([
          fetch("/api/news?lang=all", { credentials: "include" }),
          fetch("/api/employees?lang=all", { credentials: "include" }),
          fetch("/api/travel360?lang=all", { credentials: "include" }),
        ]);

        const newsData = await newsRes.json();
        const employeesData = await employeesRes.json();
        const travelData = await travelRes.json();

        setNews(Array.isArray(newsData?.data) ? newsData.data : []);
        setEmployees(
          Array.isArray(employeesData?.data) ? employeesData.data : [],
        );
        setTravelItems(Array.isArray(travelData?.data) ? travelData.data : []);
      } catch (_error) {
        setStatus(t("admin.status.unableToLoad"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authenticated]);

  const getUploadTypeForTab = (tab: AdminTab): UploadType =>
    tab === "employees"
      ? "employees"
      : tab === "travel360"
      ? "travel360"
      : "news";

  const loadImageLibrary = async (type: UploadType) => {
    try {
      const data = await fetchJson<{ data: string[] }>(`/api/images?type=${type}`);
      setImageLibrary(Array.isArray(data?.data) ? data.data : []);
      setImageLibraryError(null);
    } catch {
      setImageLibrary([]);
      setImageLibraryError("Unable to load uploaded images.");
    }
  };

  useEffect(() => {
    if (!authenticated || activeTab === "password") return;
    loadImageLibrary(getUploadTypeForTab(activeTab));
  }, [authenticated, activeTab]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data?.error || "Login failed.");
        setAuthenticated(false);
        return;
      }
      setAuthenticated(true);
      setStatus("Admin authenticated.");
    } catch {
      setStatus("Login request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuthenticated(false);
    setStatus("Logged out.");
  };

  const refreshAdminData = async () => {
    if (!authenticated) return;
    const [newsRes, employeesRes, travelRes] = await Promise.all([
      fetch("/api/news?lang=all", { credentials: "include" }),
      fetch("/api/employees?lang=all", { credentials: "include" }),
      fetch("/api/travel360?lang=all", { credentials: "include" }),
    ]);
    const newsData = await newsRes.json();
    const employeesData = await employeesRes.json();
    const travelData = await travelRes.json();
    setNews(Array.isArray(newsData?.data) ? newsData.data : []);
    setEmployees(Array.isArray(employeesData?.data) ? employeesData.data : []);
    setTravelItems(Array.isArray(travelData?.data) ? travelData.data : []);
  };

  const uploadImageFile = async (
    file: File,
    type: UploadType,
  ) => {
    setUploadingImage(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await fetchJson<{ path: string }>(`/api/upload?type=${type}`, {
        method: "POST",
        body: formData,
      });

      const normalizedPath = normalizeUploadPath(data.path || "");
      setUploadStatus(`Uploaded successfully: ${normalizedPath}`);
      await loadImageLibrary(type);
      return normalizedPath;
    } catch (error) {
      setUploadStatus(`Upload error: ${String(error)}`);
      return "";
    } finally {
      setUploadingImage(false);
    }
  };

  const submitNews = async () => {
    try {
      setLoading(true);
      setStatus(null);

      // Validate required fields
      if (!newsForm.img.trim()) {
        setStatus(t("admin.news.validation.imageRequired"));
        return;
      }

      if (!newsForm.date.trim()) {
        setStatus(t("admin.news.validation.dateRequired"));
        return;
      }

      const payload: Record<string, unknown> = {
        img: newsForm.img.trim(),
        date: newsForm.date,
      };

      if (editNewsId) {
        // For editing, update single language
        const suffix =
          newsForm.lang === "uz" ? "Uz" : newsForm.lang === "en" ? "En" : "Ru";
        const title = newsForm[`title${suffix}` as keyof NewsForm]?.trim();
        const desc = newsForm[`desc${suffix}` as keyof NewsForm]?.trim();
        const fullText = newsForm[`fullText${suffix}` as keyof NewsForm]?.trim();

        if (!title || !desc || !fullText) {
          setStatus(t("admin.news.validation.singleLanguageRequired"));
          return;
        }

        payload.title = title;
        payload.desc = desc;
        payload.fullText = fullText;
        payload.lang = newsForm.lang;
      } else {
        // For creating new news, require all three languages to have complete data
        const translations: Record<string, any> = {};

        const languages = [
          { code: "uz", suffix: "Uz" as const },
          { code: "en", suffix: "En" as const },
          { code: "ru", suffix: "Ru" as const },
        ];

        let hasValidTranslations = false;

        for (const { code, suffix } of languages) {
          const title = newsForm[`title${suffix}` as keyof NewsForm]?.trim();
          const desc = newsForm[`desc${suffix}` as keyof NewsForm]?.trim();
          const fullText = newsForm[`fullText${suffix}` as keyof NewsForm]?.trim();

          if (title && desc && fullText) {
            translations[code] = { title, desc, fullText };
            hasValidTranslations = true;
          }
        }

        if (!hasValidTranslations) {
          setStatus(t("admin.news.validation.completeTranslationRequired"));
          return;
        }

        if (Object.keys(translations).length > 0) {
          payload.translations = translations;
        } else {
          // Fallback to single language if only one is complete
          const suffix =
            newsForm.lang === "uz" ? "Uz" : newsForm.lang === "en" ? "En" : "Ru";
          const title = newsForm[`title${suffix}` as keyof NewsForm]?.trim();
          const desc = newsForm[`desc${suffix}` as keyof NewsForm]?.trim();
          const fullText = newsForm[`fullText${suffix}` as keyof NewsForm]?.trim();

          if (!title || !desc || !fullText) {
            setStatus("Title, description, and full text are required.");
            return;
          }

          payload.title = title;
          payload.desc = desc;
          payload.fullText = fullText;
          payload.lang = newsForm.lang;
        }
      }

      const response = await fetch(
        editNewsId ? `/api/news/${editNewsId}` : "/api/news",
        {
          method: editNewsId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        },
      );

      const data = await parseApiResponse(response);
      if (!response.ok) {
        setStatus(data?.error || t("admin.status.unableToSave"));
        return;
      }

      setStatus(
        editNewsId ? t("admin.news.success.updated") : t("admin.news.success.created")
      );
      setNews((prev) => {
        if (editNewsId) {
          return prev.map((item) =>
            item.id === editNewsId ? data.data : item,
          );
        }
        return [
          ...prev,
          ...(Array.isArray(data.data) ? data.data : [data.data]),
        ];
      });
      setNewsForm(defaultNewsForm);
      setEditNewsId(null);
    } catch (error) {
      console.error("News submission error:", error);
      setStatus(t("admin.status.unableToSave"));
    } finally {
      setLoading(false);
    }
  };

  const removeNews = async (id: number) => {
    await fetch(`/api/news/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setNews((prev) => prev.filter((item) => item.id !== id));
    setStatus(t("admin.news.success.deleted"));
  };

  const submitEmployee = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const body: Record<string, unknown> = {
        name: employeeForm.name,
        img: employeeForm.img,
        highlight: employeeForm.highlight,
        role: {
          uz: employeeForm.roleUz,
          en: employeeForm.roleEn,
          ru: employeeForm.roleRu,
        },
      };

      if (editEmployeeId) {
        body.lang = employeeForm.lang;
      }

      const response = await fetch(
        editEmployeeId ? `/api/employees/${editEmployeeId}` : "/api/employees",
        {
          method: editEmployeeId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setStatus(data?.error || t("admin.status.error"));
        return;
      }
      setStatus(
        editEmployeeId
          ? t("admin.employees.success.updated")
          : t("admin.employees.success.created"),
      );
      setEmployees((prev) => {
        if (editEmployeeId) {
          return prev.map((item) =>
            item.id === editEmployeeId ? data.data : item,
          );
        }
        return [
          ...prev,
          ...(Array.isArray(data.data) ? data.data : [data.data]),
        ];
      });
      setEmployeeForm(defaultEmployeeForm);
      setEditEmployeeId(null);
    } catch {
      setStatus(t("admin.status.unableToSave"));
    } finally {
      setLoading(false);
    }
  };

  const removeEmployee = async (id: number) => {
    await fetch(`/api/employees/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setEmployees((prev) => prev.filter((item) => item.id !== id));
    setStatus(t("admin.employees.success.deleted"));
  };

  const submitTravel = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const payload: Record<string, unknown> = {
        img: travelForm.img,
        order: travelForm.order,
      };

      if (editTravelId) {
        const suffix =
          travelForm.lang === "uz"
            ? "Uz"
            : travelForm.lang === "en"
              ? "En"
              : "Ru";
        payload.title = travelForm[`title${suffix}` as keyof TravelForm];
        payload.description =
          travelForm[`description${suffix}` as keyof TravelForm];
        payload.lang = travelForm.lang;
      } else {
        payload.translations = {
          uz: {
            title: travelForm.titleUz,
            description: travelForm.descriptionUz,
          },
          en: {
            title: travelForm.titleEn,
            description: travelForm.descriptionEn,
          },
          ru: {
            title: travelForm.titleRu,
            description: travelForm.descriptionRu,
          },
        };
      }

      const response = await fetch(
        editTravelId ? `/api/travel360/${editTravelId}` : "/api/travel360",
        {
          method: editTravelId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setStatus(data?.error || t("admin.status.error"));
        return;
      }
      setStatus(
        editTravelId
          ? t("admin.travel360.success.updated")
          : t("admin.travel360.success.created"),
      );
      setTravelItems((prev) => {
        if (editTravelId) {
          return prev.map((item) =>
            item.id === editTravelId ? data.data : item,
          );
        }
        return [
          ...prev,
          ...(Array.isArray(data.data) ? data.data : [data.data]),
        ];
      });
      setTravelForm(defaultTravelForm);
      setEditTravelId(null);
    } catch {
      setStatus(t("admin.status.unableToSave"));
    } finally {
      setLoading(false);
    }
  };

  const removeTravel = async (id: number) => {
    await fetch(`/api/travel360/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setTravelItems((prev) => prev.filter((item) => item.id !== id));
    setStatus(t("admin.travel360.success.deleted"));
  };

  const submitPasswordChange = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data?.error || t("admin.status.error"));
        return;
      }
      setStatus(t("admin.password.success"));
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch {
      setStatus(t("admin.status.unableToSave"));
    } finally {
      setLoading(false);
    }
  };

  if (!isAdminReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="text-center">Checking admin session...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {t("admin.login.title")}
            </h1>
            <p className="text-slate-600">
              {t("admin.title")}
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex justify-center gap-2 mb-6">
            {["uz", "en", "ru"].map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  i18n.language === lang
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700">
              {t("admin.login.username")}
            </span>
            <input
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder={t("admin.login.username")}
            />
          </label>
          <label className="block mb-6">
            <span className="text-sm font-medium text-slate-700">
              {t("admin.login.password")}
            </span>
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder={t("admin.login.password")}
            />
          </label>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
          >
            {loading ? t("admin.status.loading") : t("admin.login.signIn")}
          </button>
          {status ? (
            <p className="mt-4 text-sm text-red-600 text-center bg-red-50 p-3 rounded-xl">
              {status}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {t("admin.title")}
              </h1>
              <p className="text-slate-600">
                {t("admin.subtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Language Switcher */}
              <div className="flex gap-2 mr-4">
                {["uz", "en", "ru"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => i18n.changeLanguage(lang)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                      i18n.language === lang
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={refreshAdminData}
                disabled={loading}
                className="rounded-2xl bg-slate-100 border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t("admin.actions.refresh")}
              </button>
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 transition shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t("admin.actions.logout")}
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {status || imageLibraryError ? (
          <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200 mb-6">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                status?.includes("successfully") || status?.includes("muvaffaqiyatli")
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}>
                {status?.includes("successfully") || status?.includes("muvaffaqiyatli") ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                {status ? <p className="text-sm text-slate-800 font-medium">{status}</p> : null}
                {imageLibraryError ? (
                  <p className="text-sm text-red-600 mt-1">{imageLibraryError}</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Navigation Tabs */}
        <div className="rounded-3xl bg-white shadow-lg border border-slate-200 p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "news", label: t("admin.tabs.news") },
              { key: "employees", label: t("admin.tabs.employees") },
              { key: "travel360", label: t("admin.tabs.travel360") },
              { key: "password", label: t("admin.tabs.password") },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`rounded-2xl px-6 py-3 text-sm font-semibold transition flex items-center gap-2 ${
                  activeTab === key
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {key === "news" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                )}
                {key === "employees" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                )}
                {key === "travel360" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {key === "password" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">
          {activeTab === "news" && (
            <section className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-1">
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {editNewsId ? t("admin.actions.update") : t("admin.actions.create")} {t("admin.tabs.news")}
                    </h2>

                    <div className="space-y-6">
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          {t("admin.news.editLanguage")}
                        </span>
                        <select
                          value={newsForm.lang}
                          onChange={(event) =>
                            setNewsForm({ ...newsForm, lang: event.target.value })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                        >
                          <option value="uz">{t("admin.news.languages.uz")}</option>
                          <option value="en">{t("admin.news.languages.en")}</option>
                          <option value="ru">{t("admin.news.languages.ru")}</option>
                        </select>
                      </label>

                      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
                        <div className="space-y-4 p-5 border border-slate-200 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            {t("admin.news.languages.uz")}
                          </h3>
                          <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                              {t("admin.news.fields.title")}
                            </span>
                            <input
                              value={newsForm.titleUz}
                              onChange={(event) =>
                                setNewsForm({
                                  ...newsForm,
                                  titleUz: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                              placeholder={`${t("admin.news.fields.title")} (${t("admin.news.languages.uz")})`}
                            />
                          </label>
                          <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                              {t("admin.news.fields.description")}
                            </span>
                            <textarea
                              value={newsForm.descUz}
                              onChange={(event) =>
                                setNewsForm({
                                  ...newsForm,
                                  descUz: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                              placeholder={`${t("admin.news.fields.description")} (${t("admin.news.languages.uz")})`}
                            />
                          </label>
                          <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                              {t("admin.news.fields.fullText")}
                            </span>
                            <textarea
                              value={newsForm.fullTextUz}
                              onChange={(event) =>
                                setNewsForm({
                                  ...newsForm,
                                  fullTextUz: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[120px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                              placeholder={`${t("admin.news.fields.fullText")} (${t("admin.news.languages.uz")})`}
                            />
                          </label>
                        </div>

                        <div className="space-y-4 p-5 border border-slate-200 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            {t("admin.news.languages.en")}
                          </h3>
                          <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                              {t("admin.news.fields.title")}
                            </span>
                            <input
                              value={newsForm.titleEn}
                              onChange={(event) =>
                                setNewsForm({
                                  ...newsForm,
                                  titleEn: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                              placeholder={`${t("admin.news.fields.title")} (${t("admin.news.languages.en")})`}
                            />
                          </label>
                          <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                              {t("admin.news.fields.description")}
                            </span>
                            <textarea
                              value={newsForm.descEn}
                              onChange={(event) =>
                                setNewsForm({
                                  ...newsForm,
                                  descEn: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                              placeholder={`${t("admin.news.fields.description")} (${t("admin.news.languages.en")})`}
                            />
                          </label>
                          <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                              {t("admin.news.fields.fullText")}
                            </span>
                            <textarea
                              value={newsForm.fullTextEn}
                              onChange={(event) =>
                                setNewsForm({
                                  ...newsForm,
                                  fullTextEn: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[120px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                              placeholder={`${t("admin.news.fields.fullText")} (${t("admin.news.languages.en")})`}
                            />
                          </label>
                        </div>

                        <div className="space-y-4 p-5 border border-slate-200 rounded-3xl bg-gradient-to-br from-red-50 to-rose-50">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                            {t("admin.news.languages.ru")}
                          </h3>
                          <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                              {t("admin.news.fields.title")}
                            </span>
                            <input
                              value={newsForm.titleRu}
                              onChange={(event) =>
                                setNewsForm({
                                  ...newsForm,
                                  titleRu: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                              placeholder={`${t("admin.news.fields.title")} (${t("admin.news.languages.ru")})`}
                            />
                          </label>
                          <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                              {t("admin.news.fields.description")}
                            </span>
                            <textarea
                              value={newsForm.descRu}
                              onChange={(event) =>
                                setNewsForm({
                                  ...newsForm,
                                  descRu: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                              placeholder={`${t("admin.news.fields.description")} (${t("admin.news.languages.ru")})`}
                            />
                          </label>
                          <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                              {t("admin.news.fields.fullText")}
                            </span>
                            <textarea
                              value={newsForm.fullTextRu}
                              onChange={(event) =>
                                setNewsForm({
                                  ...newsForm,
                                  fullTextRu: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[120px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                              placeholder={`${t("admin.news.fields.fullText")} (${t("admin.news.languages.ru")})`}
                            />
                          </label>
                        </div>
                      </div>

                      <ImageField
                        label={t("admin.news.fields.image")}
                        value={newsForm.img}
                        placeholder={t("admin.news.fields.imagePlaceholder")}
                        uploading={uploadingImage}
                        status={uploadStatus}
                        images={imageLibrary}
                        onFileUpload={async (file) => {
                          const uploadedPath = await uploadImageFile(file, "news");
                          if (uploadedPath) {
                            setNewsForm({ ...newsForm, img: uploadedPath });
                          }
                        }}
                        onPathChange={(value) =>
                          setNewsForm({ ...newsForm, img: normalizeUploadPath(value) })
                        }
                        onSelectImage={(value) =>
                          setNewsForm({ ...newsForm, img: value })
                        }
                      />
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          {t("admin.news.fields.date")}
                        </span>
                        <input
                          type="date"
                          value={newsForm.date}
                          onChange={(event) =>
                            setNewsForm({ ...newsForm, date: event.target.value })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                        />
                      </label>

                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-blue-800">
                            {t("admin.news.help")}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={submitNews}
                        disabled={loading}
                        className="w-full rounded-2xl bg-indigo-600 text-white py-4 font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("admin.status.loading")}
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {editNewsId ? t("admin.actions.update") : t("admin.actions.create")} {t("admin.tabs.news")}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Existing News List */}
                  <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t("admin.news.existingTitle")}
                    </h3>

                    <div className="space-y-4">
                      {news.length === 0 ? (
                        <div className="text-center py-12">
                          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-slate-500 text-lg">{t("admin.news.noNews")}</p>
                        </div>
                      ) : (
                        news.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 p-5 hover:shadow-md transition bg-gradient-to-r from-white to-slate-50"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">
                                  {item.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.lang === 'uz' ? 'bg-blue-100 text-blue-800' :
                                    item.lang === 'en' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {t(`admin.news.languages.${item.lang}`)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {item.date}
                                  </span>
                                </div>
                                <p className="text-slate-600 text-sm line-clamp-2">
                                  {item.desc}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditNewsId(item.id);
                                    setNewsForm({
                                      titleUz: item.lang === "uz" ? item.title : "",
                                      titleEn: item.lang === "en" ? item.title : "",
                                      titleRu: item.lang === "ru" ? item.title : "",
                                      descUz: item.lang === "uz" ? item.desc : "",
                                      descEn: item.lang === "en" ? item.desc : "",
                                      descRu: item.lang === "ru" ? item.desc : "",
                                      fullTextUz: item.lang === "uz" ? item.fullText : "",
                                      fullTextEn: item.lang === "en" ? item.fullText : "",
                                      fullTextRu: item.lang === "ru" ? item.fullText : "",
                                      img: item.img,
                                      date: item.date.slice(0, 10),
                                      lang: item.lang,
                                    });
                                  }}
                                  className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 transition flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  {t("admin.actions.edit")}
                                </button>
                                <button
                                  onClick={() => removeNews(item.id)}
                                  className="rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  {t("admin.actions.delete")}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "employees" && (
            <section className="space-y-8">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {t("admin.employees.title")}
                  </h2>
                  <label className="block">
                    <span className="text-sm text-slate-700">Name</span>
                    <input
                      value={employeeForm.name}
                      onChange={(event) =>
                        setEmployeeForm({
                          ...employeeForm,
                          name: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <ImageField
                    label="Upload employee image"
                    value={employeeForm.img}
                    placeholder="/uploads/employees/your-image.jpg"
                    uploading={uploadingImage}
                    status={uploadStatus}
                    images={imageLibrary}
                    onFileUpload={async (file) => {
                      const uploadedPath = await uploadImageFile(file, "employees");
                      if (uploadedPath) {
                        setEmployeeForm({ ...employeeForm, img: uploadedPath });
                      }
                    }}
                    onPathChange={(value) =>
                      setEmployeeForm({
                        ...employeeForm,
                        img: normalizeUploadPath(value),
                      })
                    }
                    onSelectImage={(value) =>
                      setEmployeeForm({ ...employeeForm, img: value })
                    }
                  />
                  <label className="block">
                    <span className="text-sm text-slate-700">Role (Uz)</span>
                    <input
                      value={employeeForm.roleUz}
                      onChange={(event) =>
                        setEmployeeForm({
                          ...employeeForm,
                          roleUz: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Role (En)</span>
                    <input
                      value={employeeForm.roleEn}
                      onChange={(event) =>
                        setEmployeeForm({
                          ...employeeForm,
                          roleEn: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Role (Ru)</span>
                    <input
                      value={employeeForm.roleRu}
                      onChange={(event) =>
                        setEmployeeForm({
                          ...employeeForm,
                          roleRu: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={employeeForm.highlight}
                      onChange={(event) =>
                        setEmployeeForm({
                          ...employeeForm,
                          highlight: event.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">
                      Highlight card
                    </span>
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Language</span>
                    <select
                      value={employeeForm.lang}
                      onChange={(event) =>
                        setEmployeeForm({
                          ...employeeForm,
                          lang: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    >
                      <option value="uz">Uz</option>
                      <option value="en">En</option>
                      <option value="ru">Ru</option>
                    </select>
                  </label>
                  <button
                    onClick={submitEmployee}
                    className="rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700"
                    disabled={loading}
                  >
                    {editEmployeeId ? "Update Employee" : "Create Employee"}
                  </button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Existing Employees</h2>
                  <div className="space-y-4">
                    {employees.length === 0 ? (
                      <p className="text-slate-500">No employees found.</p>
                    ) : (
                      employees.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-3xl border border-slate-200 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-xs text-slate-500">
                                {item.lang}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditEmployeeId(item.id);
                                  setEmployeeForm({
                                    name: item.name,
                                    img: item.img,
                                    lang: item.lang,
                                    highlight: Boolean(item.highlight),
                                    roleUz:
                                      typeof item.role === "object"
                                        ? item.role.uz
                                        : String(item.role),
                                    roleEn:
                                      typeof item.role === "object"
                                        ? item.role.en
                                        : String(item.role),
                                    roleRu:
                                      typeof item.role === "object"
                                        ? item.role.ru
                                        : String(item.role),
                                  });
                                }}
                                className="rounded-2xl bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeEmployee(item.id)}
                                className="rounded-2xl bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "travel360" && (
            <section className="space-y-8">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {t("admin.travel360.title")}
                  </h2>
                  <label className="block">
                    <span className="text-sm text-slate-700">
                      Edit language
                    </span>
                    <select
                      value={travelForm.lang}
                      onChange={(event) =>
                        setTravelForm({
                          ...travelForm,
                          lang: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    >
                      <option value="uz">Uz</option>
                      <option value="en">En</option>
                      <option value="ru">Ru</option>
                    </select>
                  </label>

                  <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
                    <div className="space-y-4 p-4 border border-slate-200 rounded-3xl bg-slate-50">
                      <h3 className="text-lg font-semibold">Uzbek</h3>
                      <label className="block">
                        <span className="text-sm text-slate-700">
                          Title (Uz)
                        </span>
                        <input
                          value={travelForm.titleUz}
                          onChange={(event) =>
                            setTravelForm({
                              ...travelForm,
                              titleUz: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">
                          Description (Uz)
                        </span>
                        <textarea
                          value={travelForm.descriptionUz}
                          onChange={(event) =>
                            setTravelForm({
                              ...travelForm,
                              descriptionUz: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px]"
                        />
                      </label>
                    </div>

                    <div className="space-y-4 p-4 border border-slate-200 rounded-3xl bg-slate-50">
                      <h3 className="text-lg font-semibold">English</h3>
                      <label className="block">
                        <span className="text-sm text-slate-700">
                          Title (En)
                        </span>
                        <input
                          value={travelForm.titleEn}
                          onChange={(event) =>
                            setTravelForm({
                              ...travelForm,
                              titleEn: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">
                          Description (En)
                        </span>
                        <textarea
                          value={travelForm.descriptionEn}
                          onChange={(event) =>
                            setTravelForm({
                              ...travelForm,
                              descriptionEn: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px]"
                        />
                      </label>
                    </div>

                    <div className="space-y-4 p-4 border border-slate-200 rounded-3xl bg-slate-50">
                      <h3 className="text-lg font-semibold">Russian</h3>
                      <label className="block">
                        <span className="text-sm text-slate-700">
                          Title (Ru)
                        </span>
                        <input
                          value={travelForm.titleRu}
                          onChange={(event) =>
                            setTravelForm({
                              ...travelForm,
                              titleRu: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">
                          Description (Ru)
                        </span>
                        <textarea
                          value={travelForm.descriptionRu}
                          onChange={(event) =>
                            setTravelForm({
                              ...travelForm,
                              descriptionRu: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px]"
                        />
                      </label>
                    </div>
                  </div>

                  <ImageField
                    label="Upload 360 image"
                    value={travelForm.img}
                    placeholder="/uploads/travel360/your-image.jpg"
                    uploading={uploadingImage}
                    status={uploadStatus}
                    images={imageLibrary}
                    onFileUpload={async (file) => {
                      const uploadedPath = await uploadImageFile(file, "travel360");
                      if (uploadedPath) {
                        setTravelForm({ ...travelForm, img: uploadedPath });
                      }
                    }}
                    onPathChange={(value) =>
                      setTravelForm({
                        ...travelForm,
                        img: normalizeUploadPath(value),
                      })
                    }
                    onSelectImage={(value) =>
                      setTravelForm({ ...travelForm, img: value })
                    }
                  />
                  <label className="block">
                    <span className="text-sm text-slate-700">Order</span>
                    <input
                      type="number"
                      value={travelForm.order}
                      min={1}
                      onChange={(event) =>
                        setTravelForm({
                          ...travelForm,
                          order: Number(event.target.value),
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <p className="text-sm text-slate-500">
                    When creating a new 360 travel item, all three language
                    versions are stored together.
                  </p>
                  <button
                    onClick={submitTravel}
                    className="rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700"
                    disabled={loading}
                  >
                    {editTravelId ? "Update Item" : "Create Item"}
                  </button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Existing 360 Items</h2>
                  <div className="space-y-4">
                    {travelItems.length === 0 ? (
                      <p className="text-slate-500">No travel items found.</p>
                    ) : (
                      travelItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-3xl border border-slate-200 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-xs text-slate-500">
                                Order {item.order}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditTravelId(item.id);
                                  setTravelForm({
                                    titleUz:
                                      item.lang === "uz" ? item.title : "",
                                    titleEn:
                                      item.lang === "en" ? item.title : "",
                                    titleRu:
                                      item.lang === "ru" ? item.title : "",
                                    descriptionUz:
                                      item.lang === "uz"
                                        ? item.description
                                        : "",
                                    descriptionEn:
                                      item.lang === "en"
                                        ? item.description
                                        : "",
                                    descriptionRu:
                                      item.lang === "ru"
                                        ? item.description
                                        : "",
                                    img: item.img,
                                    order: item.order,
                                    lang: item.lang as string,
                                  });
                                }}
                                className="rounded-2xl bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeTravel(item.id)}
                                className="rounded-2xl bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "password" && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">{t("admin.password.title")}</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-slate-700">
                    {t("admin.password.fields.current")}
                  </span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-700">
                    {t("admin.password.fields.new")}
                  </span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  />
                </label>
              </div>
              <button
                onClick={submitPasswordChange}
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700"
                disabled={loading}
              >
                {t("admin.password.changePassword")}
              </button>
              <p className="text-sm text-slate-500">
                Default admin credentials are: <strong>director</strong> / <strong>director</strong>.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
