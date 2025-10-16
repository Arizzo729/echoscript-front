<<<<<<< Updated upstream
// Single source of truth for i18n.
// Re-export the configured instance from i18n.js to avoid double initialization.
export { default } from "./i18n";
=======
// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import es from "./es";
import zh from "./zh"; // ✅ Add Chinese

const resources = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh }, // ✅ Register Chinese
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
>>>>>>> Stashed changes
