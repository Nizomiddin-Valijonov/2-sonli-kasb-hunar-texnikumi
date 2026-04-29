"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getNewsById, getImageUrl } from "../../../services/api";

interface Props {
  id: string;
  lng: string;
}

export interface NewsItem {
  id: number;
  title: string;
  desc: string;
  fullText: string;
  img: string;
  date: string;
}

export default function NewsDetailClient({ id }: Props) {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsById(id);
        const data = response.data?.data || response.data || null;

        if (data?.id) setNews(data);
        else setError("Yangilik topilmadi");
      } catch {
        setError("Server bilan bog‘lanishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600">{error} 😔</h2>
        <button
          onClick={() => router.push("/news")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    );

  if (!news)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Yangilik topilmadi 😔
      </div>
    );

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      <p className="text-gray-500 text-sm mb-3">
        {new Date(news.date).toLocaleDateString("uz-UZ")}
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-secondary">
        {news.title}
      </h1>
      <div className="relative w-full h-72 sm:h-[400px] rounded-2xl overflow-hidden mb-6 shadow-md">
        <Image
          src={getImageUrl(news.img, "news") || "/gerb.svg"}
          alt={news.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <p className="text-gray-700 text-lg leading-relaxed mb-6">{news.desc}</p>
      <div className="text-gray-800 text-base leading-8 border-l-4 border-primary pl-4 mb-10">
        {news.fullText}
      </div>
      <button
        onClick={() => router.back()}
        className="px-6 py-3 bg-primary text-white rounded-xl"
      >
        ← Ortga
      </button>
    </article>
  );
}
