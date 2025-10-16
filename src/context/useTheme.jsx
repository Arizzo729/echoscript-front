import React, { createContext } from "react";

// TODO: Implement theme switching logic (e.g., light/dark)
export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Placeholder value
  const value = { theme: "dark", setTheme: () => {} };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}