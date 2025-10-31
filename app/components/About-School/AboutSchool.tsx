"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import img1 from "../../assets/Carousel/school.jpg";
import img2 from "../../assets/Carousel/class with students.jpg";
import img3 from "../../assets/Carousel/lybrary.jpg";
import img4 from "../../assets/Carousel/gym.jpg";

const AboutSchool = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white" id="about-school">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-16 px-4 md:px-6">
        {/* LEFT SIDE */}
        <div className="flex-1 md:max-w-[45%] text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
            {t("about.title")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {t("about.description1")}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("about.description2")}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 relative w-full max-w-[600px] mx-auto">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            effect="fade"
            pagination={{
              clickable: true,
              renderBullet: (index, className) => {
                return `<span class="${className} w-10 h-[3px] rounded-full inline-block mx-1 bg-gray-300 transition-all"></span>`;
              },
            }}
            loop
            className="rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          >
            {[img1, img2, img3, img4].map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-[350px] md:h-[420px]">
                  <Image
                    src={img}
                    alt={`Slide ${i + 1}`}
                    fill
                    className="object-cover scale-105 transition-transform duration-[2500ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default AboutSchool;
