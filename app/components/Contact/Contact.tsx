"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail } from "lucide-react";

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
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left - Contact Info */}
          <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {t("contact.address.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("contact.address.text")}
                </p>
                <a
                  href="https://maps.google.com/maps?q=40.996606,71.640076&ll=40.996606,71.640076&z=16"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-blue-600 font-medium hover:underline"
                >
                  Lokatsiya
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="bg-green-100 p-3 rounded-xl">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {t("contact.phone.title")}
                </h3>
                <a
                  href="tel:+998692333592"
                  className="text-blue-600 font-medium hover:underline"
                >
                  +998 69 233 35 92
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {t("contact.email.title")}
                </h3>
                <a
                  href="mailto:info@namangan2sonkxm.uz"
                  className="text-blue-600 font-medium hover:underline"
                >
                  info@namangan2sonkxm.uz
                </a>
              </div>
            </div>
          </div>

          {/* Right - Map */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1">
            <iframe
              src="https://maps.google.com/maps?q=40.996606,71.640076&ll=40.996606,71.640076&z=16&output=embed"
              className="w-full h-[400px] md:h-[450px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Overlay info badge */}
            <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Namangan shahri, Amir Temur ko‘cha, 101 uy
              </span>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
