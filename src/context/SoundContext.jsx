import React, { createContext, useContext } from "react";

// TODO: Implement sound effects logic
export const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  // Placeholder value
  const value = { enableSound: () => console.log("Sound enabled") };
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export const useSound = () => useContext(SoundContext) || { enableSound: () => {} };