"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { getNews, getImageUrl } from "../../services/api";
import LoadingState from "../../ui/LoadingState";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
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

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getNews(currentLang);

      const data =
        Array.isArray(response.data?.data) && response.data.data.length
          ? response.data.data
          : [];

      if (!data.length) setError("empty");
      setNewsList(data);
    } catch {
      setError("network");
    } finally {
      setLoading(false);
    }
  }, [currentLang]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  if (loading) {
    return (
      <LoadingState
        message={t("news.loading")}
        skeletonCount={4}
        skeletonClassName="w-72 h-72 bg-gray-200 rounded-2xl animate-pulse"
        bgClassName="py-24 bg-gradient-to-b from-purple-50 to-white text-center"
      />
    );
  }

  if (error === "network" && !newsList.length) {
    return (
      <ErrorState
        title={t("news.errorTitle") || "Server ishlamayapti"}
        description={
          t("news.errorDesc") ||
          "Kechirasiz, hozir server bilan aloqa o'rnatib bo'lmadi. Keyinroq urinib ko'ring."
        }
        retryText={t("news.retry") || "Qayta urinib ko'rish"}
        onRetry={fetchNews}
      />
    );
  }

  if (!newsList.length) {
    return (
      <EmptyState
        title={t("news.empty") || "Yangiliklar topilmadi"}
        description={
          t("news.emptyDesc") || "Hozircha bu bo'limda yangiliklar mavjud emas."
        }
      />
    );
  }

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
          {newsList.map((news) => {
            const imageUrl = getImageUrl(news.img, "news");

            return (
              <div
                key={news.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-52">
                  <Image
                    src={imageUrl || logo}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default News;
