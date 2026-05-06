"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Logo/hero_logo.png";

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      className="relative bg-gradient-to-br from-[#013D8C] to-violet-500 text-white py-24 md:py-32"
      id="main"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 gap-10 mt-52 md:mt-20">
        {/* Left content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {t("hero.title")} <br />
            <span className="text-yellow-300">{t("hero.subtitle")}</span>
          </h1>

          <p className="text-lg text-gray-100 mb-8 max-w-xl mx-auto md:mx-0">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#news"
              className="bg-yellow-300 text-blue-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-yellow-400 transition"
            >
              {t("hero.buttonNews")}
            </a>
            <a
              href="#contact"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
            >
              {t("hero.buttonContact")}
            </a>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 flex justify-center">
          <Image
            src={logo}
            alt="Maktab illustration"
            className="w-72 md:w-full drop-shadow-lg drop-shadow-blue-300"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
