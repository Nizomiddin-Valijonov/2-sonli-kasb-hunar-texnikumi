"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

const LANGUAGES = [
  { code: "uz", label: "🇺🇿 O‘zbekcha" },
  { code: "en", label: "🇬🇧 English" },
  { code: "ru", label: "🇷🇺 Русский" },
];

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang =
    pathname.split("/")[1] &&
    ["uz", "en", "ru"].includes(pathname.split("/")[1])
      ? pathname.split("/")[1]
      : "uz";

  // Tashqariga bosganda yopish
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
    if (lng === currentLang) return;
    const newPath = pathname.replace(`/${currentLang}`, `/${lng}`);
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 bg-secondary hover:bg-orange-400 text-sm px-3 py-2 rounded-lg font-medium transition-colors duration-200"
      >
        <Globe className="w-4 h-4" />
        {currentLang.toUpperCase()}
      </button>

      {open && (
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
