import { useEffect, useState, useCallback } from "react";

const THEME_STORAGE_KEY = "theme-preference";

function getPreferredTheme() {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(getPreferredTheme); // ✅ No type annotation

  // Sync theme to <html> class and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const timeout = setTimeout(() => {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      window.dispatchEvent(new CustomEvent("theme-changed", { detail: theme }));
    }, 100);

    return () => clearTimeout(timeout);
  }, [theme]);

  // Listen to system changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function onChange(event) {
      setTheme(event.matches ? "dark" : "light");
    }

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}

export function ThemeProvider({ children }) {
  return children;
}

