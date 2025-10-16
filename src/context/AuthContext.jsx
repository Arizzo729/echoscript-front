import React, { createContext } from "react";

// TODO: Implement full authentication logic
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Placeholder value
  const value = { user: null, loading: true };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}