import os
import shutil

# Constants
OUTPUT_DIR = "/mnt/data"
JSX_FILENAME = "useFontSize.jsx"
ZIP_FILENAME = "useFontSize_updated.zip"
JSX_PATH = os.path.join(OUTPUT_DIR, JSX_FILENAME)
ZIP_PATH = os.path.join(OUTPUT_DIR, ZIP_FILENAME)

# JSX Source Code
jsx_source = """\
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
      <div style={{ fontSize: \`\${clampedSize}em\` }}>{children}</div>
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}

export { FontSizeContext };
"""

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Write JSX file
with open(JSX_PATH, "w", encoding="utf-8") as file:
    file.write(jsx_source)

# Create zip archive
shutil.make_archive(ZIP_PATH.replace(".zip", ""), 'zip', OUTPUT_DIR, JSX_FILENAME)

ZIP_PATH


