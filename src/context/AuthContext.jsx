import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import api from "../lib/api"; // uses the file above

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("es_user") || "null"); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("es_user", JSON.stringify(user));
    else localStorage.removeItem("es_user");
  }, [user]);

  const svc = useMemo(() => ({
    // IMPORTANT: use /signup and /login (not /register)
    signUp: (payload) => api.signup(payload),
    signIn: (payload) => api.login(payload),
    signOut: () => api.logout(),
  }), []);

  const signUp = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await svc.signUp({ email, password });
      setUser({ email, ...("user" in data ? data.user : {}) });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password, remember }) => {
    setLoading(true);
    try {
      const data = await svc.signIn({ email, password, remember: !!remember });
      if (data?.access_token) localStorage.setItem("es_token", data.access_token);
      if (data?.refresh_token) localStorage.setItem("es_refresh", data.refresh_token);
      setUser({ email, ...("user" in data ? data.user : {}) });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try { await svc.signOut(); } catch {}
    localStorage.removeItem("es_token");
    localStorage.removeItem("es_refresh");
    setUser(null);
  };

  const value = { user, loading, signUp, signIn, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

