// app/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uz from "./locales/uz/translation.json";
import en from "./locales/en/translation.json";
import ru from "./locales/ru/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uz },
      en: { translation: en },
      ru: { translation: ru },
    },
    fallbackLng: "uz",
    detection: {
      order: ["localStorage", "navigator"],
    },
    interpolation: {
      escapeValue: false,
    },
    // 👇 Mana muhim joy
    react: {
      useSuspense: false,
    },
    // 👇 SSR’ni o‘chirish
    initImmediate: false,
  });

export default i18n;
