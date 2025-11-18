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
                  href="tel:+998901234567"
                  className="text-blue-600 font-medium hover:underline"
                >
                  +998 91 350 00 74
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
                  href="mailto:info@33maktab.uz"
                  className="text-blue-600 font-medium hover:underline"
                >
                  info@33maktab.uz
                </a>
              </div>
            </div>
          </div>

          {/* Right - Map */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6020.86702711172!2d71.55797309009115!3d41.01577065712889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb352edefbf02d%3A0xa7af028de9e6a717!2s84-MAKTAB!5e0!3m2!1sru!2s!4v1762872957719!5m2!1sru!2s"
              className="w-full h-[400px] md:h-[450px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Overlay info badge */}
            <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                84-Maktab joylashuvi
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
