"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Logo & Short Text */}
        <div>
          <h2 className="text-xl font-bold text-white">
            {t("footer.schoolName")}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {t("footer.description")}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            {t("footer.linksTitle")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.links.home")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.links.news")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.links.about")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.links.contact")}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            {t("footer.contactTitle")}
          </h3>
          <p className="text-sm">{t("footer.address")}</p>
          <p className="text-sm">{t("footer.phone")}</p>
          <p className="text-sm">{t("footer.email")}</p>

          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {t("footer.schoolName")}.{" "}
        {t("footer.copyright")}
      </div>
    </footer>
  );
}

export default Footer;
