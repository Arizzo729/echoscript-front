import React, { createContext } from "react";

// TODO: Implement font size adjustment logic
export const FontSizeContext = createContext(null);

export function FontSizeProvider({ children }) {
  // Placeholder value
  return <FontSizeContext.Provider value={null}>{children}</FontSizeContext.Provider>;
}