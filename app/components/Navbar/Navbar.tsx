"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "../Language-Switcher/LanguageSwitcher";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-primary shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1 className="text-xl font-bold text-white tracking-wide cursor-pointer">
          33-Maktab
        </h1>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-8 text-white font-medium">
          <li className="hover:text-gray-200 transition cursor-pointer">
            <a href="#main">Asosiy</a>
          </li>
          <li className="hover:text-gray-200 transition cursor-pointer">
            <a href="#about-school">Maktab haqida</a>
          </li>
          <li className="hover:text-gray-200 transition cursor-pointer">
            <a href="#employees">Hodimlar</a>
          </li>
          <li className="hover:text-gray-200 transition cursor-pointer">
            <a href="#news">Yangiliklar</a>
          </li>
          <li className="hover:text-gray-200 transition cursor-pointer">
            <a href="#contact">Aloqa</a>
          </li>
        </ul>

        {/* CTA button */}
        <LanguageSwitcher />

        {/* Mobile menu button */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-primary/95 shadow-md animate-fadeIn">
          <ul className="flex flex-col gap-6 p-6 text-white font-medium">
            <li className="hover:text-gray-200 transition cursor-pointer">
              Asosiy
            </li>
            <li className="hover:text-gray-200 transition cursor-pointer">
              Maktab haqida
            </li>
            <li className="hover:text-gray-200 transition cursor-pointer">
              Hodimlar
            </li>
            <li className="hover:text-gray-200 transition cursor-pointer">
              Yangiliklar
            </li>
            <li className="hover:text-gray-200 transition cursor-pointer">
              Aloqa
            </li>
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
