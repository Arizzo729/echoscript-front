import { createContext, useContext, useState } from "react";

export const FontSizeContext = createContext(); // ✅ named export

export function FontSizeProvider({ children }) {
  const [fontSize, setFontSize] = useState(1);
  const MIN = 0.85, MAX = 1.25;
  const clampedSize = Math.min(Math.max(fontSize, MIN), MAX);

  return (
    <FontSizeContext.Provider value={{ fontSize: clampedSize, setFontSize }}>
      <div style={{ fontSize: `${clampedSize}em` }}>{children}</div>
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext); // ✅ optional hook
