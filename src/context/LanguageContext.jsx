import React, { createContext } from "react";

// TODO: Implement internationalization (i18n) logic
export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Placeholder value
  return <LanguageContext.Provider value={null}>{children}</LanguageContext.Provider>;
}