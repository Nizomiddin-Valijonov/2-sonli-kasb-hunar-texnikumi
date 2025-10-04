"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import egovLogo from "../../assets/Government Logos/egov.png";
import hukumatPortali from "../../assets/Government Logos/hukumat portali.jpg";
import kutubxona from "../../assets/Government Logos/kutubxona.jpg";
import ochiqAxborot from "../../assets/Government Logos/ochiq axborot.jpg";

const links = [
  {
    id: 1,
    img: "/gerb.svg",
    title: "Ўзбекистон Республикаси Президентининг расмий веб-сайти",
    url: "https://president.uz",
  },
  {
    id: 2,
    img: "/gerb.svg",
    title: "Ўзбекистон Республикаси Президентининг Виртуал қабулхонаси",
    url: "https://pm.gov.uz",
  },
  {
    id: 3,
    img: hukumatPortali,
    title: "Ўзбекистон Республикасининг ҳукумат портали",
    url: "https://gov.uz",
  },
  {
    id: 4,
    img: egovLogo,
    title: "Ягона Интерактив Давлат хизматлари портали",
    url: "https://my.gov.uz",
  },
  {
    id: 5,
    img: kutubxona,
    title: "Республика болалар кутубхонаси",
    url: "https://kitob.uz",
  },
  {
    id: 6,
    img: ochiqAxborot,
    title: "Ўзбекистон Республикаси очиқ ахборот портали",
    url: "https://data.gov.uz",
  },
  {
    id: 7,
    img: "/gerb.svg",
    title: "Ўзбекистон Республикаси Конституцияси",
    url: "https://constitution.uz",
  },
];

const CarouselLinks = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-brand-main">
        Фойдали ҳаволалар
      </h2>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          // ✅ MEDIA BREAKPOINTS (har xil ekranlar uchun)
          breakpoints={{
            0: { slidesPerView: 1.3, spaceBetween: 16 }, // eng kichik (mobile)
            480: { slidesPerView: 2, spaceBetween: 20 }, // kichik telefon
            640: { slidesPerView: 2.5, spaceBetween: 24 }, // katta telefon
            768: { slidesPerView: 3.2, spaceBetween: 28 }, // planshet
            1024: { slidesPerView: 4.2, spaceBetween: 30 }, // laptop
            1280: { slidesPerView: 5.2, spaceBetween: 32 }, // katta ekran
            1536: { slidesPerView: 6, spaceBetween: 36 }, // ultra-wide
          }}
          className="pb-10"
        >
          {links.map((item) => (
            <SwiperSlide key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
              >
                <div className="border border-gray-200 rounded-full p-6 sm:p-8 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <p className="text-xs sm:text-sm mt-4 text-gray-700 group-hover:text-brand-secondary transition max-w-[160px]">
                  {item.title}
                </p>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow hover:bg-brand-main hover:text-white transition">
          <ChevronLeft size={20} />
        </button>
        <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow hover:bg-brand-main hover:text-white transition">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default CarouselLinks;
