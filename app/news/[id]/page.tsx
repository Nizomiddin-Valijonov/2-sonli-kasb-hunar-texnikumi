"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// Demo yangiliklar (keyinchalik backenddan keladi)
const newsData = [
  {
    id: 1,
    title: "Maktabimizda yangi sport zal ochildi",
    desc: "33-maktabda o‘quvchilar uchun zamonaviy sport zali ishga tushirildi. Endilikda futbol, basketbol va voleybol mashg‘ulotlari yuqori darajada o‘tkaziladi.",
    fullText:
      "33-maktabda yangi sport zalning ochilishi o‘quvchilar uchun katta imkoniyat yaratdi. Endi o‘quvchilar sport bilan muntazam shug‘ullanishlari, jismoniy rivojlanishlari uchun barcha sharoitlar mavjud. Sport zali zamonaviy uskunalar bilan jihozlangan bo‘lib, futbol, basketbol, voleybol va gimnastika mashg‘ulotlari uchun mo‘ljallangan.",
    img: "/images/news/sportzal.jpg",
    date: "2025-09-20",
  },
  {
    id: 2,
    title: "O‘quvchilarimiz matematika olimpiadasida g‘olib bo‘ldi",
    desc: "Viloyat miqyosidagi olimpiadada 33-maktab o‘quvchilari faxrli 1-o‘rinni egallashdi.",
    fullText:
      "Olimpiadada ishtirok etgan 33-maktabning 9-sinf o‘quvchilari matematika bo‘yicha yuqori natijalar ko‘rsatishdi. Ular orasida Bobur Mamatov va Dilorom Rustamova 1-o‘rinni egallashdi. Maktab rahbariyati tomonidan faxriy yorliq va esdalik sovg‘alari topshirildi.",
    img: "/images/news/olimpiada.jpg",
    date: "2025-09-25",
  },
];

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const news = newsData.find((item) => item.id === Number(id));

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-secondary mb-2">
          Yangilik topilmadi 😔
        </h2>
        <button
          onClick={() => router.push("/news")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-all"
        >
          Bosh sahifaga qaytish
        </button>
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
          src={news.img}
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
