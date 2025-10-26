"use client";

import "../../i18n/index";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import clsx from "clsx";
import i18n from "@/app/i18n";

const LANGUAGES = [
  { code: "uz", label: "🇺🇿 O‘zbekcha" },
  { code: "en", label: "🇬🇧 English" },
  { code: "ru", label: "🇷🇺 Русский" },
];

const LanguageSwitcher = () => {
  const { i18n: i18nextInstance } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔹 Tashqariga bosilganda yopiladi
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    if (lng === i18nextInstance.language) return;
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setOpen(false);
  };

  if (!mounted) return null;

  const currentLang = i18nextInstance.language?.split("-")[0]?.toUpperCase();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-secondary hover:bg-orange-400 text-sm px-3 py-2 rounded-lg font-medium transition-colors duration-200"
      >
        <Globe className="w-4 h-4" />
        {currentLang || "UZ"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden animate-fade-in z-50">
          {LANGUAGES.map((lng) => (
            <button
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={clsx(
                "w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-150",
                lng.code === i18nextInstance.language?.split("-")[0]
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              {lng.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
