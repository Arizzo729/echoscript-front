// src/hooks/useTranslation.jsx
import { useContext, useEffect, useCallback } from "react";
import i18n from "../i18n"; // single source of truth (re-export from i18n.js or i18n/index.js)
import { LanguageContext } from "../context/LanguageContext";

export default function useTranslation() {
  const { lang } = useContext(LanguageContext);

  useEffect(() => {
    if (!lang || i18n.language === lang) return;
    i18n.changeLanguage(lang).catch((e) => console.warn("i18n changeLanguage failed:", e));
  }, [lang]);

  const t = useCallback(
    (key, options) => {
      try {
        return i18n.t(key, options);
      } catch {
        return key;
      }
    },
    []
  );

  return t;
}