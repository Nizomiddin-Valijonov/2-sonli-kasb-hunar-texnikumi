"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"news" | "employees" | "travel360" | "password">("news");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);

  const [loginUsername, setLoginUsername] = useState("director");
  const [loginPassword, setLoginPassword] = useState("director");

  const [newsForm, setNewsForm] = useState<NewsForm>(defaultNewsForm);
  const [employeeForm, setEmployeeForm] = useState<EmployeeForm>(defaultEmployeeForm);
  const [travelForm, setTravelForm] = useState<TravelForm>(defaultTravelForm);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });

  const [editNewsId, setEditNewsId] = useState<number | null>(null);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [editTravelId, setEditTravelId] = useState<number | null>(null);

  const isAdminReady = useMemo(() => authenticated !== null, [authenticated]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session", { credentials: "include" });
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
        setEmployees(Array.isArray(employeesData?.data) ? employeesData.data : []);
        setTravelItems(Array.isArray(travelData?.data) ? travelData.data : []);
      } catch (error) {
        setStatus("Unable to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authenticated]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
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
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
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

  const uploadImageFile = async (file: File, type: "news" | "employees" | "travel360") => {
    setUploadingImage(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`/api/upload?type=${type}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Image upload failed.");
      }

      setUploadStatus(`Uploaded successfully: ${data.path}`);
      return data.path;
    } catch (error) {
      setUploadStatus(`Upload error: ${String(error)}`);
      return "";
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "news" | "employees" | "travel360",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedPath = await uploadImageFile(file, type);
    if (!uploadedPath) return;

    if (type === "news") {
      setNewsForm({ ...newsForm, img: uploadedPath });
    } else if (type === "employees") {
      setEmployeeForm({ ...employeeForm, img: uploadedPath });
    } else if (type === "travel360") {
      setTravelForm({ ...travelForm, img: uploadedPath });
    }
  };

  const submitNews = async () => {
    try {
      setLoading(true);
      setStatus(null);

      const payload: any = {
        img: newsForm.img,
        date: newsForm.date,
      };

      if (editNewsId) {
        const suffix = newsForm.lang === "uz" ? "Uz" : newsForm.lang === "en" ? "En" : "Ru";
        payload.title = newsForm[`title${suffix}` as keyof NewsForm];
        payload.desc = newsForm[`desc${suffix}` as keyof NewsForm];
        payload.fullText = newsForm[`fullText${suffix}` as keyof NewsForm];
        payload.lang = newsForm.lang;
      } else {
        payload.translations = {
          uz: {
            title: newsForm.titleUz,
            desc: newsForm.descUz,
            fullText: newsForm.fullTextUz,
          },
          en: {
            title: newsForm.titleEn,
            desc: newsForm.descEn,
            fullText: newsForm.fullTextEn,
          },
          ru: {
            title: newsForm.titleRu,
            desc: newsForm.descRu,
            fullText: newsForm.fullTextRu,
          },
        };
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

      const data = await response.json();
      if (!response.ok) {
        setStatus(data?.error || "News save failed.");
        return;
      }

      setStatus(editNewsId ? "News updated successfully." : "News saved successfully.");
      setNews((prev) => {
        if (editNewsId) {
          return prev.map((item) => (item.id === editNewsId ? data.data : item));
        }
        return [...prev, ...(Array.isArray(data.data) ? data.data : [data.data])];
      });
      setNewsForm(defaultNewsForm);
      setEditNewsId(null);
    } catch {
      setStatus("Unable to save news.");
    } finally {
      setLoading(false);
    }
  };

  const removeNews = async (id: number) => {
    await fetch(`/api/news/${id}`, { method: "DELETE", credentials: "include" });
    setNews((prev) => prev.filter((item) => item.id !== id));
    setStatus("News removed.");
  };

  const submitEmployee = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const body: any = {
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
        setStatus(data?.error || "Employee save failed.");
        return;
      }
      setStatus(editEmployeeId ? "Employee updated successfully." : "Employee saved successfully.");
      setEmployees((prev) => {
        if (editEmployeeId) {
          return prev.map((item) => (item.id === editEmployeeId ? data.data : item));
        }
        return [...prev, ...(Array.isArray(data.data) ? data.data : [data.data])];
      });
      setEmployeeForm(defaultEmployeeForm);
      setEditEmployeeId(null);
    } catch {
      setStatus("Unable to save employee.");
    } finally {
      setLoading(false);
    }
  };

  const removeEmployee = async (id: number) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE", credentials: "include" });
    setEmployees((prev) => prev.filter((item) => item.id !== id));
    setStatus("Employee removed.");
  };

  const submitTravel = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const payload: any = {
        img: travelForm.img,
        order: travelForm.order,
      };

      if (editTravelId) {
        const suffix = travelForm.lang === "uz" ? "Uz" : travelForm.lang === "en" ? "En" : "Ru";
        payload.title = travelForm[`title${suffix}` as keyof TravelForm];
        payload.description = travelForm[`description${suffix}` as keyof TravelForm];
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
        setStatus(data?.error || "Travel item save failed.");
        return;
      }
      setStatus(editTravelId ? "Travel item updated successfully." : "Travel item saved successfully.");
      setTravelItems((prev) => {
        if (editTravelId) {
          return prev.map((item) => (item.id === editTravelId ? data.data : item));
        }
        return [...prev, ...(Array.isArray(data.data) ? data.data : [data.data])];
      });
      setTravelForm(defaultTravelForm);
      setEditTravelId(null);
    } catch {
      setStatus("Unable to save travel item.");
    } finally {
      setLoading(false);
    }
  };

  const removeTravel = async (id: number) => {
    await fetch(`/api/travel360/${id}`, { method: "DELETE", credentials: "include" });
    setTravelItems((prev) => prev.filter((item) => item.id !== id));
    setStatus("Travel item removed.");
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
        setStatus(data?.error || "Password change failed.");
        return;
      }
      setStatus("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch {
      setStatus("Unable to change password.");
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block mb-6">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
          {status ? <p className="mt-4 text-sm text-red-600">{status}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage news, employees, 360 travel items, and admin password.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={refreshAdminData}
              className="rounded-2xl bg-white border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-2xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {status ? (
          <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200 mb-6">
            <p className="text-sm text-slate-800">{status}</p>
          </div>
        ) : null}

        <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {(["news", "employees", "travel360", "password"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab === "news" && "News"}
                {tab === "employees" && "Employees"}
                {tab === "travel360" && "360 Travel"}
                {tab === "password" && "Change Password"}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">
          {activeTab === "news" && (
            <section className="space-y-8">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Create / Update News</h2>
                  <label className="block">
                    <span className="text-sm text-slate-700">Edit language</span>
                    <select
                      value={newsForm.lang}
                      onChange={(event) => setNewsForm({ ...newsForm, lang: event.target.value })}
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
                        <span className="text-sm text-slate-700">Title (Uz)</span>
                        <input
                          value={newsForm.titleUz}
                          onChange={(event) => setNewsForm({ ...newsForm, titleUz: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">Short Description (Uz)</span>
                        <textarea
                          value={newsForm.descUz}
                          onChange={(event) => setNewsForm({ ...newsForm, descUz: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px]"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">Full Text (Uz)</span>
                        <textarea
                          value={newsForm.fullTextUz}
                          onChange={(event) => setNewsForm({ ...newsForm, fullTextUz: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[120px]"
                        />
                      </label>
                    </div>

                    <div className="space-y-4 p-4 border border-slate-200 rounded-3xl bg-slate-50">
                      <h3 className="text-lg font-semibold">English</h3>
                      <label className="block">
                        <span className="text-sm text-slate-700">Title (En)</span>
                        <input
                          value={newsForm.titleEn}
                          onChange={(event) => setNewsForm({ ...newsForm, titleEn: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">Short Description (En)</span>
                        <textarea
                          value={newsForm.descEn}
                          onChange={(event) => setNewsForm({ ...newsForm, descEn: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px]"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">Full Text (En)</span>
                        <textarea
                          value={newsForm.fullTextEn}
                          onChange={(event) => setNewsForm({ ...newsForm, fullTextEn: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[120px]"
                        />
                      </label>
                    </div>

                    <div className="space-y-4 p-4 border border-slate-200 rounded-3xl bg-slate-50">
                      <h3 className="text-lg font-semibold">Russian</h3>
                      <label className="block">
                        <span className="text-sm text-slate-700">Title (Ru)</span>
                        <input
                          value={newsForm.titleRu}
                          onChange={(event) => setNewsForm({ ...newsForm, titleRu: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">Short Description (Ru)</span>
                        <textarea
                          value={newsForm.descRu}
                          onChange={(event) => setNewsForm({ ...newsForm, descRu: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px]"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">Full Text (Ru)</span>
                        <textarea
                          value={newsForm.fullTextRu}
                          onChange={(event) => setNewsForm({ ...newsForm, fullTextRu: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[120px]"
                        />
                      </label>
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-sm text-slate-700">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, "news")}
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Image path</span>
                    <input
                      value={newsForm.img}
                      onChange={(event) => setNewsForm({ ...newsForm, img: event.target.value })}
                      placeholder="/uploads/news/your-image.jpg"
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      File upload is preferred. If you paste a path, make sure it points to a valid public image.
                    </p>
                  </label>
                  {uploadStatus && (
                    <p className="text-sm text-slate-500">{uploadStatus}</p>
                  )}
                  <label className="block">
                    <span className="text-sm text-slate-700">Date</span>
                    <input
                      type="date"
                      value={newsForm.date}
                      onChange={(event) => setNewsForm({ ...newsForm, date: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <p className="text-sm text-slate-500">When creating new news, all three language versions are stored together.</p>
                  <button
                    onClick={submitNews}
                    className="rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700"
                    disabled={loading}
                  >
                    {editNewsId ? "Update News" : "Create News"}
                  </button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Existing News</h2>
                  <div className="space-y-4">
                    {news.length === 0 ? (
                      <p className="text-slate-500">No news items found.</p>
                    ) : (
                      news.map((item) => (
                        <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-xs text-slate-500">{item.lang} - {item.date}</p>
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
                                className="rounded-2xl bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeNews(item.id)}
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

          {activeTab === "employees" && (
            <section className="space-y-8">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Create / Update Employee</h2>
                  <label className="block">
                    <span className="text-sm text-slate-700">Name</span>
                    <input
                      value={employeeForm.name}
                      onChange={(event) => setEmployeeForm({ ...employeeForm, name: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, "employees")}
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Image path</span>
                    <input
                      value={employeeForm.img}
                      onChange={(event) => setEmployeeForm({ ...employeeForm, img: event.target.value })}
                      placeholder="/uploads/employees/your-image.jpg"
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Upload is preferred; manual path is only for advanced use.
                    </p>
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Role (Uz)</span>
                    <input
                      value={employeeForm.roleUz}
                      onChange={(event) => setEmployeeForm({ ...employeeForm, roleUz: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Role (En)</span>
                    <input
                      value={employeeForm.roleEn}
                      onChange={(event) => setEmployeeForm({ ...employeeForm, roleEn: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Role (Ru)</span>
                    <input
                      value={employeeForm.roleRu}
                      onChange={(event) => setEmployeeForm({ ...employeeForm, roleRu: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={employeeForm.highlight}
                      onChange={(event) =>
                        setEmployeeForm({ ...employeeForm, highlight: event.target.checked })
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">Highlight card</span>
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Language</span>
                    <select
                      value={employeeForm.lang}
                      onChange={(event) => setEmployeeForm({ ...employeeForm, lang: event.target.value })}
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
                        <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-xs text-slate-500">{item.lang}</p>
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
                                    roleUz: typeof item.role === "object" ? item.role.uz : String(item.role),
                                    roleEn: typeof item.role === "object" ? item.role.en : String(item.role),
                                    roleRu: typeof item.role === "object" ? item.role.ru : String(item.role),
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
                  <h2 className="text-xl font-semibold">Create / Update 360 Travel</h2>
                  <label className="block">
                    <span className="text-sm text-slate-700">Edit language</span>
                    <select
                      value={travelForm.lang}
                      onChange={(event) => setTravelForm({ ...travelForm, lang: event.target.value })}
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
                        <span className="text-sm text-slate-700">Title (Uz)</span>
                        <input
                          value={travelForm.titleUz}
                          onChange={(event) => setTravelForm({ ...travelForm, titleUz: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">Description (Uz)</span>
                        <textarea
                          value={travelForm.descriptionUz}
                          onChange={(event) => setTravelForm({ ...travelForm, descriptionUz: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px]"
                        />
                      </label>
                    </div>

                    <div className="space-y-4 p-4 border border-slate-200 rounded-3xl bg-slate-50">
                      <h3 className="text-lg font-semibold">English</h3>
                      <label className="block">
                        <span className="text-sm text-slate-700">Title (En)</span>
                        <input
                          value={travelForm.titleEn}
                          onChange={(event) => setTravelForm({ ...travelForm, titleEn: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">Description (En)</span>
                        <textarea
                          value={travelForm.descriptionEn}
                          onChange={(event) => setTravelForm({ ...travelForm, descriptionEn: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px]"
                        />
                      </label>
                    </div>

                    <div className="space-y-4 p-4 border border-slate-200 rounded-3xl bg-slate-50">
                      <h3 className="text-lg font-semibold">Russian</h3>
                      <label className="block">
                        <span className="text-sm text-slate-700">Title (Ru)</span>
                        <input
                          value={travelForm.titleRu}
                          onChange={(event) => setTravelForm({ ...travelForm, titleRu: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-700">Description (Ru)</span>
                        <textarea
                          value={travelForm.descriptionRu}
                          onChange={(event) => setTravelForm({ ...travelForm, descriptionRu: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none min-h-[100px]"
                        />
                      </label>
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-sm text-slate-700">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, "travel360")}
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Image path</span>
                    <input
                      value={travelForm.img}
                      onChange={(event) => setTravelForm({ ...travelForm, img: event.target.value })}
                      placeholder="/uploads/travel360/your-image.jpg"
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Upload is preferred; manual path is only for advanced use.
                    </p>
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-700">Order</span>
                    <input
                      type="number"
                      value={travelForm.order}
                      min={1}
                      onChange={(event) =>
                        setTravelForm({ ...travelForm, order: Number(event.target.value) })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </label>
                  <p className="text-sm text-slate-500">When creating a new 360 travel item, all three language versions are stored together.</p>
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
                        <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-xs text-slate-500">Order {item.order}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditTravelId(item.id);
                                  setTravelForm({
                                    titleUz: item.lang === "uz" ? item.title : "",
                                    titleEn: item.lang === "en" ? item.title : "",
                                    titleRu: item.lang === "ru" ? item.title : "",
                                    descriptionUz: item.lang === "uz" ? item.description : "",
                                    descriptionEn: item.lang === "en" ? item.description : "",
                                    descriptionRu: item.lang === "ru" ? item.description : "",
                                    img: item.img,
                                    order: item.order,
                                    lang: item.lang,
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
              <h2 className="text-xl font-semibold">Change Admin Password</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-slate-700">Current Password</span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm({ ...passwordForm, currentPassword: event.target.value })
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-700">New Password</span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm({ ...passwordForm, newPassword: event.target.value })
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
                Update Password
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
