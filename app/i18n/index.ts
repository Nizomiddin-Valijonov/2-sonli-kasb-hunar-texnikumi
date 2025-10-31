"use client";

import i18next, { type InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";

import uz from "./locales/uz/translation.json";
import en from "./locales/en/translation.json";
import ru from "./locales/ru/translation.json";

const options: InitOptions = {
  resources: {
    uz: { translation: uz },
    en: { translation: en },
    ru: { translation: ru },
  },
  fallbackLng: "uz",
  supportedLngs: ["uz", "en", "ru"],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  initImmediate: false,
};

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init(options);
}

export default i18next;
