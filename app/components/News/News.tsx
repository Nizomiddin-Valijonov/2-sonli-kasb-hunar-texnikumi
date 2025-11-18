"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { WifiOff, AlertCircle } from "lucide-react";
import logo from "../../assets/News/news.jpg";

interface NewsItem {
  id: number;
  title: string;
  desc: string;
  img: string;
  date: string;
}

const News = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentLang =
    pathname.split("/")[1] &&
    ["uz", "en", "ru"].includes(pathname.split("/")[1])
      ? pathname.split("/")[1]
      : "uz";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://api.nam-school84.uz/api/news?lang=${currentLang}`
        );

        const data =
          Array.isArray(response.data?.data) && response.data.data.length
            ? response.data.data
            : [];

        if (!data.length) setError(t("news.empty"));
        setNewsList(data);
      } catch (err) {
        setError(t("news.error") || "Server bilan aloqa yo‘q.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentLang, t]);

  // 🌀 LOADING STATE
  if (loading)
    return (
      <section className="py-24 bg-gradient-to-b from-purple-50 to-white text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {t("news.loading")}
        </h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-72 h-72 bg-gray-200 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    );

  // ❌ ERROR STATE
  if (error && !newsList.length)
    return (
      <section className="py-32 bg-gradient-to-b from-red-50 to-white text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-red-100 text-red-600 p-6 rounded-full">
            <WifiOff size={48} />
          </div>
          <h2 className="text-3xl font-bold text-red-700">
            {t("news.errorTitle") || "Server ishlamayapti"}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {t("news.errorDesc") ||
              "Kechirasiz, hozir server bilan aloqa o‘rnatib bo‘lmadi. Keyinroq urinib ko‘ring."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {t("news.retry") || "Qayta urinib ko‘rish"}
          </button>
        </div>
      </section>
    );

  // ⚠️ BO‘SH STATE
  if (!newsList.length)
    return (
      <section className="py-32 bg-gray-100 text-center">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle size={48} className="text-gray-500" />
          <h2 className="text-2xl font-semibold text-gray-700">
            {t("news.empty") || "Yangiliklar topilmadi"}
          </h2>
          <p className="text-gray-500">
            {t("news.emptyDesc") ||
              "Hozircha bu bo‘limda yangiliklar mavjud emas."}
          </p>
        </div>
      </section>
    );

  // ✅ MAIN CONTENT
  return (
    <section
      className="py-24 px-6 bg-gradient-to-b from-purple-50 to-white"
      id="news"
    >
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-16 tracking-tight">
          {t("news.title")}
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-52">
                <Image
                  src={
                    news.img
                      ? `https://api.nam-school84.uz/api/news${news.img}`
                      : logo
                  }
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm text-gray-500 mb-2">
                  {new Date(news.date).toLocaleDateString(currentLang, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-4">
                  {news.desc}
                </p>
                <Link
                  href={`/${currentLang}/news/${news.id}`}
                  className="mt-auto inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition text-center"
                >
                  {t("news.readMore")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
