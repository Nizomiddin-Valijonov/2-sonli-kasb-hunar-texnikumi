import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uzTranslation from "./locales/uz/translation.json";
import enTranslation from "./locales/en/translation.json";
import ruTranslation from "./locales/ru/translation.json";

i18n
  .use(LanguageDetector) // avtomatik browser tili aniqlaydi
  .use(initReactI18next)
  .init({
    fallbackLng: "uz", // agar til topilmasa UZ bo‘ladi
    debug: false, // devda true qilsa ham bo‘ladi

    interpolation: {
      escapeValue: false,
    },

    resources: {
      uz: { translation: uzTranslation },
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
    },
  });

export default i18n;
