import { createContext, useContext, useState, useEffect } from "react";

const FontSizeContext = createContext();

const MIN = 0.85;
const MAX = 1.25;
const STORAGE_KEY = "font-size";

export function FontSizeProvider({ children }) {
  const [fontSize, setFontSize] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed)) setFontSize(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, fontSize.toFixed(2));
  }, [fontSize]);

  const clampedSize = Math.min(Math.max(fontSize, MIN), MAX);

  return (
    <FontSizeContext.Provider value={{ fontSize: clampedSize, setFontSize }}>
      <div style={{ fontSize: `${clampedSize}em` }}>{children}</div>
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}

export { FontSizeContext };


