import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const THEME_STORAGE_KEY = "theme-preference";
const ThemeContext = createContext();

function getPreferredTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useThemeSync() {
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");

    const timeout = setTimeout(() => {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      window.dispatchEvent(new CustomEvent("theme-changed", { detail: theme }));
    }, 100);

    return () => clearTimeout(timeout);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}

export function ThemeProvider({ children }) {
  const value = useThemeSync();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}


