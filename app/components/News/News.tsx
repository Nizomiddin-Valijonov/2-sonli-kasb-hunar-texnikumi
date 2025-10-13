import React from "react";
import Image from "next/image";
import Link from "next/link";
import img from "../../assets/News/news.jpg";

const News = () => {
  const newsList = [
    {
      id: 1,
      title: "Maktabimizda yangi sport zal ochildi",
      desc: "33-maktabda o‘quvchilar uchun zamonaviy sport zali ishga tushirildi. Endilikda futbol, basketbol va voleybol mashg‘ulotlari yuqori darajada o‘tkaziladi.",
      img: img,
      date: "2025-09-20",
    },
    {
      id: 2,
      title: "O‘quvchilarimiz respublika olimpiadasida g‘olib bo‘ldi",
      desc: "Matematika fanidan o‘quvchilarimiz respublika miqyosida faxrli o‘rinlarni qo‘lga kiritdi. Ularni samimiy tabriklaymiz!",
      img: img,
      date: "2025-09-15",
    },
    {
      id: 3,
      title: "Kutubxonaga 1000 dan ortiq yangi kitoblar keldi",
      desc: "Maktab kutubxonasi yangi adabiyotlar bilan boyitildi. Endilikda o‘quvchilar badiiy va ilmiy kitoblardan keng foydalanishlari mumkin.",
      img: img,
      date: "2025-09-10",
    },
    {
      id: 4,
      title: "Kutubxonaga 1000 dan ortiq yangi kitoblar keldi",
      desc: "Maktab kutubxonasi yangi adabiyotlar bilan boyitildi. Endilikda o‘quvchilar badiiy va ilmiy kitoblardan keng foydalanishlari mumkin.",
      img: img,
      date: "2025-09-10",
    },
  ];

  return (
    <section className="py-20 bg-purple-600 px-6" id="news">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-14">
          So‘nggi Yangiliklar
        </h2>

        <div className="grid gap-10 md:grid-cols-4">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
            >
              <Image
                src={news.img}
                alt={news.title}
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
                  href={`/news/${news?.id}`}
                  className="mt-auto inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition text-center"
                >
                  Batafsil o‘qish
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
