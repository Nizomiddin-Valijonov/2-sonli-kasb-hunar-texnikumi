"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import egovLogo from "../../assets/Government Logos/egov.png";
import hukumatPortali from "../../assets/Government Logos/hukumat portali.jpg";
import kutubxona from "../../assets/Government Logos/kutubxona.jpg";
import ochiqAxborot from "../../assets/Government Logos/ochiq axborot.jpg";
import gerb from "../../assets/gerb.svg";

const CarouselLinks = () => {
  const { t } = useTranslation();

  const links = [
    {
      id: 1,
      img: gerb,
      title: t("carousel.links.1"),
      url: "https://president.uz",
    },
    {
      id: 2,
      img: gerb,
      title: t("carousel.links.2"),
      url: "https://pm.gov.uz",
    },
    {
      id: 3,
      img: hukumatPortali,
      title: t("carousel.links.3"),
      url: "https://gov.uz",
    },
    {
      id: 4,
      img: egovLogo,
      title: t("carousel.links.4"),
      url: "https://my.gov.uz",
    },
    {
      id: 5,
      img: kutubxona,
      title: t("carousel.links.5"),
      url: "https://kitob.uz",
    },
    {
      id: 6,
      img: ochiqAxborot,
      title: t("carousel.links.6"),
      url: "https://data.gov.uz",
    },
    {
      id: 7,
      img: gerb,
      title: t("carousel.links.7"),
      url: "https://constitution.uz",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-brand-main">
        {t("carousel.title")}
      </h2>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          breakpoints={{
            0: { slidesPerView: 1.3, spaceBetween: 16 },
            480: { slidesPerView: 2, spaceBetween: 20 },
            640: { slidesPerView: 2.5, spaceBetween: 24 },
            768: { slidesPerView: 3.2, spaceBetween: 28 },
            1024: { slidesPerView: 4.2, spaceBetween: 30 },
            1280: { slidesPerView: 5.2, spaceBetween: 32 },
            1536: { slidesPerView: 6, spaceBetween: 36 },
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
