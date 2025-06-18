import { createContext, useState, useEffect, useMemo, useContext } from "react";

export const LanguageContext = createContext();

const langOptions = ["en", "es", "fr", "de"]; // Easily extendable

export const LanguageProvider = ({ children }) => {
  const getInitialLang = () => {
    if (typeof window === "undefined") return "en"; // SSR-safe
    return localStorage.getItem("lang") || navigator.language.slice(0, 2) || "en";
  };

  const [lang, setLang] = useState(getInitialLang);

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
};

// ✅ Optional hook for convenience
export const useLanguage = () => useContext(LanguageContext);
