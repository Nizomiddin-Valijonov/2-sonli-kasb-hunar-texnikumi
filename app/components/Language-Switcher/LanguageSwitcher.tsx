"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import clsx from "clsx";

const LANGUAGES = [
  { code: "uz", label: "🇺🇿 O‘zbekcha" },
  { code: "en", label: "🇬🇧 English" },
  { code: "ru", label: "🇷🇺 Русский" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Dropdown tashqarisiga bosilganda yopish
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

  // 🔹 Tilni o‘zgartirish funksiyasi
  const changeLanguage = (lng: string) => {
    if (lng === i18n.language) return;

    const currentLang = i18n.language;
    const hasLangPrefix = pathname.startsWith(`/${currentLang}`);

    let newPath = pathname;
    if (hasLangPrefix) {
      newPath = pathname.replace(`/${currentLang}`, `/${lng}`);
    } else {
      newPath = `/${lng}${pathname}`;
    }

    i18n.changeLanguage(lng);
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 🔘 Tugma */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-2 rounded-lg font-medium transition-colors duration-200"
      >
        <Globe className="w-4 h-4" />
        {i18n.language?.toUpperCase()}
      </button>

      {/* 🌍 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden animate-fade-in z-50">
          {LANGUAGES.map((lng) => (
            <button
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={clsx(
                "w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-150",
                lng.code === i18n.language
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
