"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Language-Switcher/LanguageSwitcher";
import i18n from "../../i18n";
import Image from "next/image";
import logo from "../../assets/UzEDU.png";

const Navbar = ({ lng }: { lng: string }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (i18n.language !== lng) {
      i18n.changeLanguage(lng);
      document.documentElement.lang = lng;
    }
  }, [lng]);

  const menuItems = [
    { id: "main", label: t("navbar.main") },
    { id: "about-school", label: t("navbar.about") },
    { id: "employees", label: t("navbar.employees") },
    { id: "news", label: t("navbar.news") },
    { id: "contact", label: t("navbar.contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-primary shadow-lg" : "bg-transparent"
      }`}
    >
      {/* Top section */}
      <div
        className={`text-white py-3 px-4 md:px-16 flex flex-col md:flex-row justify-between items-center gap-3 transition-all duration-500`}
      >
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="UzEDU Logo"
            className="h-12 w-auto object-contain scale-185"
            priority
          />
          <div className="leading-tight pl-3">
            <h2 className="text-[10px] md:text-[13px] font-semibold uppercase tracking-wide">
              NAMANGAN VILOYATI
            </h2>
            <h2 className="text-[9px] md:text-[13px] font-bold uppercase tracking-wide">
              2-SONLI KASB HUNAR TEXNIKUMI
            </h2>
            <h4 className="text-[12px] text-gray-200 italic">
              rasmiy veb-sayti
            </h4>
          </div>
        </div>

        {/* Phone + language */}
        <div className="flex items-center gap-5">
          <div className="hidden md:flex flex-col items-end text-right">
            <p className="text-lg font-semibold hover:text-green-300 transition-colors duration-300 cursor-pointer">
              +998 69 233 35 92
            </p>
            <p className="text-xs text-gray-200">Ishonch telefoni</p>
          </div>
          <div className="md:hidden text-white">
            <Phone size={22} />
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Bottom nav */}
      <nav
        className={`transition-all duration-500 border-t border-white/10 ${
          scrolled ? "bg-secondary/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center px-4 md:px-16 py-3">
          <ul className="hidden md:flex items-center gap-8 text-white font-medium text-sm uppercase tracking-wide">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className="relative group cursor-pointer transition-all duration-300"
              >
                <a
                  href={`#${item.id}`}
                  className="transition-all duration-300 group-hover:text-green-200 group-active:scale-95"
                >
                  {item.label}
                </a>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-300 transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="text-white md:hidden hover:scale-110 transition-transform duration-200"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden bg-secondary border-t border-green-800 animate-fadeIn">
            <ul className="flex flex-col gap-4 p-5 text-white text-sm font-medium uppercase">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="hover:text-green-100 active:scale-95 transition-all duration-200"
                >
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
              <li className="pt-2 border-t border-green-900">
                <LanguageSwitcher />
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
