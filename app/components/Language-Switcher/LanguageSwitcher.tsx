"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import i18next from "../../i18n"; // ⚠️ pathni sening loyihangdagi joylashuvga moslashtir

const LANGUAGES = [
  { code: "uz", label: "🇺🇿 O‘zbekcha" },
  { code: "en", label: "🇬🇧 English" },
  { code: "ru", label: "🇷🇺 Русский" },
];

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang =
    pathname.split("/")[1] &&
    ["uz", "en", "ru"].includes(pathname.split("/")[1])
      ? pathname.split("/")[1]
      : "uz";

  // 🔹 Tashqariga bosganda dropdown yopish
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

  // 🔥 Tilni o‘zgartirish
  const changeLanguage = async (lng: string) => {
    if (lng === currentLang) return;
    setLoading(true);

    try {
      // i18next ichki tilini darhol o‘zgartirish
      await i18next.changeLanguage(lng);
      localStorage.setItem("i18nextLng", lng);

      // URL yo‘lini o‘zgartirish
      const newPath = pathname.replace(`/${currentLang}`, `/${lng}`);
      router.push(newPath);

      // ixtiyoriy: router.refresh() bilan server komponentlarni yangilash
      // router.refresh();
    } finally {
      // biroz kutish (transition effekt uchun)
      setTimeout(() => setLoading(false), 400);
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={loading}
        className={clsx(
          "flex items-center gap-2 bg-secondary text-sm px-3 py-2 rounded-lg font-medium transition-all duration-200",
          loading ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-400"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <Globe className="w-4 h-4" />
            {currentLang.toUpperCase()}
          </>
        )}
      </button>

      {open && !loading && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
          {LANGUAGES.map((lng) => (
            <button
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={clsx(
                "w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-150",
                lng.code === currentLang
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
