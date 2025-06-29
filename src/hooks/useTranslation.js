// src/hooks/useTranslation.js
import { useContext } from "react";
import translations from "../i18n";
import { LanguageContext } from "../context/LanguageContext";

export default function useTranslation() {
  const { lang } = useContext(LanguageContext);
  return (key) => translations[lang]?.[key] || translations["en"][key] || key;
}
