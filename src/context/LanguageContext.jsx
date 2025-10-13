<<<<<<< Updated upstream
// src/context/LanguageContext.jsx
import { createContext, useState, useEffect, useMemo, useContext, useCallback } from "react";
import i18n from "../i18n";

export const LanguageContext = createContext();

const supported = ["en", "es", "fr", "de", "zh"];
=======
import { createContext, useState, useEffect, useMemo, useContext } from "react";

export const LanguageContext = createContext();

const langOptions = ["en", "es", "fr", "de"];
>>>>>>> Stashed changes

export const LanguageProvider = ({ children }) => {
  const getInitialLang = () => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem("lang");
<<<<<<< Updated upstream
    const browserLang = (navigator.language || "en").slice(0, 2);
    if (supported.includes(stored)) return stored;
    if (supported.includes(browserLang)) return browserLang;
    return "en";
=======
    const browserLang = navigator.language.slice(0, 2);
    return langOptions.includes(stored) ? stored : langOptions.includes(browserLang) ? browserLang : "en";
>>>>>>> Stashed changes
  };

  const [lang, setLang] = useState(getInitialLang);

<<<<<<< Updated upstream
  // persist selection
  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  // keep i18next synchronized with context language
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang).catch((e) => console.warn("i18n changeLanguage failed:", e));
    }
  }, [lang]);

  // cycle through supported languages
  const toggleLang = useCallback(() => {
    const idx = supported.indexOf(lang);
    const next = supported[(idx + 1) % supported.length];
    setLang(next);
  }, [lang]);

  const value = useMemo(() => ({ lang, toggleLang, setLang, supported }), [lang, toggleLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
=======
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleLang = () => {
    const currentIndex = langOptions.indexOf(lang);
    const nextLang = langOptions[(currentIndex + 1) % langOptions.length];
    setLang(nextLang);
  };

  const value = useMemo(() => ({ lang, toggleLang, setLang }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
>>>>>>> Stashed changes
};

export const useLanguage = () => useContext(LanguageContext);

