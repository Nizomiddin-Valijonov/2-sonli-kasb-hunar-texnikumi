"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation"; // ✅ URL pathni olish uchun
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

  // 🔥 URL dan tilni olish
  const currentLang =
    pathname.split("/")[1] &&
    ["uz", "en", "ru"].includes(pathname.split("/")[1])
      ? pathname.split("/")[1]
      : "uz";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        // 🔥 URL’dagi lang bo‘yicha API chaqiramiz
        const response = await axios.get(
          `http://localhost:5050/api/news?lang=${currentLang}`
        );

        if (response.data?.data && Array.isArray(response.data.data)) {
          setNewsList(response.data.data);
        } else {
          setError("Ma'lumotlar topilmadi");
        }
      } catch (err) {
        console.error(err);
        setError("Server bilan bog‘lanishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentLang]); // ✅ Til o‘zgarganda qayta chaqiriladi

  // --- Loading holati ---
  if (loading) {
    return (
      <section className="py-20 bg-purple-600 text-center text-white">
        <h2 className="text-2xl font-semibold">{t("news.loading")}</h2>
      </section>
    );
  }

  // --- Xatolik holati ---
  if (error) {
    return (
      <section className="py-20 bg-purple-600 text-center text-white">
        <h2 className="text-2xl font-semibold">{error}</h2>
      </section>
    );
  }

  // --- Bo‘sh holat ---
  if (!newsList.length) {
    return (
      <section className="py-20 bg-purple-600 text-center text-white">
        <h2 className="text-2xl font-semibold">{t("news.empty")}</h2>
      </section>
    );
  }

  // --- Asosiy kontent ---
  return (
    <section className="py-20 bg-purple-600 px-6" id="news">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-14">
          {t("news.title")}
        </h2>

        <div className="grid gap-10 md:grid-cols-4">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
            >
              <Image
                src={
                  news?.img ? `http://localhost:5050/api/news${news.img}` : logo
                }
                alt={news?.title || "News image"}
                width={400}
                height={250}
                className="w-full h-52 object-cover"
              />

              <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm text-gray-500 mb-2">
                  {new Date(news.date).toLocaleDateString("uz-UZ")}
                </span>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-4">
                  {news.desc}
                </p>
                <Link
                  href={`/${currentLang}/news/${news.id}`}
                  className="mt-auto inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition text-center"
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
