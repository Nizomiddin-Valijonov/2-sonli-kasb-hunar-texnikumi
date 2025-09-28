"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import img1 from "../../assets/Carousel/school.jpg";
import img2 from "../../assets/Carousel/class with students.jpg";
import img3 from "../../assets/Carousel/lybrary.jpg";
import img4 from "../../assets/Carousel/gym.jpg";
import Image from "next/image";

function AboutSchool() {
  return (
    <section className="py-20 bg-gray-50" id="about-school">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 px-4 md:px-6">
        {/* Left - Text */}
        <div className="flex-1 text-center md:text-left md:max-w-[50%]">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">
            Maktab haqida
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
            33-Maktab – yosh avlod uchun bilim va ma’naviyat maskani. Bizning
            maqsadimiz o‘quvchilarni zamonaviy bilimlar bilan qurollantirish,
            mustaqil fikrlaydigan, vatanparvar va maqsadli yoshlarni
            tarbiyalashdir.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Maktabimizda tajribali o‘qituvchilar jamoasi, zamonaviy o‘quv
            xonalari, sport zallari va turli to‘garaklar mavjud. Har bir bola
            o‘z iste’dodini ochib berishi uchun keng imkoniyatlar yaratilgan.
          </p>
        </div>

        {/* Right - Swiper carousel */}
        <div className="flex-1 w-full md:w-1/2 max-w-[600px] mx-auto">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop={true}
            className="rounded-2xl shadow-lg min-h-[300px] md:min-h-[400px]"
          >
            <SwiperSlide>
              <Image
                src={img1}
                alt="Maktab binosi"
                className="w-full h-full object-cover rounded-2xl"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={img2}
                alt="O‘quvchilar dars jarayonida"
                className="w-full h-full object-cover rounded-2xl"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={img3}
                alt="Kutubxona"
                className="w-full h-full object-cover rounded-2xl"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={img4}
                alt="Sport zali"
                className="w-full h-full object-cover rounded-2xl"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default AboutSchool;
