import { createContext, useState, useEffect, useMemo, useContext } from "react";
import i18n from "../i18n/i18n";

export const LanguageContext = createContext();

const langOptions = ["en", "es", "zh"];

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('language') || i18n.language || "en";
  });

  useEffect(() => {
    const handleLangChange = (lng) => {
      setLang(lng);
      localStorage.setItem('language', lng);
    };
    i18n.on('languageChanged', handleLangChange);
    return () => i18n.off('languageChanged', handleLangChange);
  }, []);

  const toggleLang = () => {
    const currentIndex = langOptions.indexOf(lang);
    const nextLang = langOptions[(currentIndex + 1) % langOptions.length];
    i18n.changeLanguage(nextLang);
  };

  const value = useMemo(() => ({ lang, toggleLang, setLang: (l) => i18n.changeLanguage(l) }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

