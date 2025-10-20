"use client";
import React from "react";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {t("contact.title")}
          </h2>
          <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left - Contact Info */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t("contact.address.title")}
              </h3>
              <p className="text-gray-600">{t("contact.address.text")}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t("contact.phone.title")}
              </h3>
              <a
                href="tel:+998901234567"
                className="text-blue-600 font-medium hover:underline"
              >
                +998 90 123 45 67
              </a>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t("contact.email.title")}
              </h3>
              <a
                href="mailto:info@33maktab.uz"
                className="text-blue-600 font-medium hover:underline"
              >
                info@33maktab.uz
              </a>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-white shadow-md rounded-2xl p-8">
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  placeholder={t("contact.form.namePlaceholder") || ""}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contact.form.email")}
                </label>
                <input
                  type="email"
                  placeholder={t("contact.form.emailPlaceholder") || ""}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contact.form.message")}
                </label>
                <textarea
                  rows={4}
                  placeholder={t("contact.form.messagePlaceholder") || ""}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-primary transition"
              >
                {t("contact.form.send")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
