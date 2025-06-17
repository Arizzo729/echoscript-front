import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en";
import es from "./es";

// 🔧 Initialize i18n
i18n
  .use(LanguageDetector) // ✅ Detect user language via browser
  .use(initReactI18next) // ✅ Integrates with React
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: "en", // 🌐 Fallback language
    debug: false,      // Toggle to true if you want to log translation issues
    interpolation: {
      escapeValue: false, // ✅ React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'], // Try localStorage first
      caches: ['localStorage'],             // Cache language choice
    },
    react: {
      useSuspense: false, // Optional: disables suspense fallback
    },
  });

export default i18n;
