"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Language-Switcher/LanguageSwitcher";
import i18n from "../../i18n";

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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-primary shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-white tracking-wide cursor-pointer">
          33-Maktab
        </h1>

        <ul className="hidden md:flex gap-8 text-white font-medium items-center">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="hover:text-gray-200 transition cursor-pointer"
            >
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
          <li>
            <LanguageSwitcher />
          </li>
        </ul>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-primary/95 shadow-md animate-fadeIn">
          <ul className="flex flex-col gap-6 p-6 text-white font-medium">
            {menuItems.map((item) => (
              <li key={item.id} className="hover:text-gray-200 transition">
                {item.label}
              </li>
            ))}
            <li>
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
