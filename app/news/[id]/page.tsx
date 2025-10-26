"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

interface NewsItem {
  id: number;
  title: string;
  desc: string;
  fullText: string;
  img: string;
  date: string;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/news/${id}`);
        console.log("News detail:", res.data);

        // API tuzilmasiga qarab:
        const data =
          res.data && res.data.data ? res.data.data : res.data || null;

        if (data && data.id) {
          setNews(data);
        } else {
          setError("Yangilik topilmadi");
        }
      } catch (err) {
        console.error(err);
        setError("Server bilan bog‘lanishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 text-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
        Ma'lumot yuklanmoqda...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">{error} 😔</h2>
        <button
          onClick={() => router.push("/news")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-all"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        Yangilik topilmadi 😔
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      {/* Date */}
      <p className="text-gray-500 text-sm mb-3">
        {new Date(news.date).toLocaleDateString("uz-UZ")}
      </p>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-secondary leading-tight">
        {news.title}
      </h1>

      {/* Image */}
      <div className="relative w-full h-72 sm:h-[400px] rounded-2xl overflow-hidden mb-6 shadow-md">
        <Image
          src={news.img || "/images/default-news.jpg"}
          alt={news.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Description */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">{news.desc}</p>

      {/* Full Text */}
      <div className="text-gray-800 text-base leading-8 border-l-4 border-primary pl-4 mb-10">
        {news.fullText}
      </div>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-block px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-all"
      >
        ← Ortga
      </button>
    </article>
  );
}
