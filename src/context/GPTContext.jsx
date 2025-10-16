import React, { createContext } from "react";

// TODO: Implement GPT/AI-related state management
export const GPTContext = createContext(null);

export function GPTProvider({ children }) {
  // Placeholder value
  return <GPTContext.Provider value={null}>{children}</GPTContext.Provider>;
}