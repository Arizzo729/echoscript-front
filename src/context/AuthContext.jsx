import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api"; // adjust to "../lib/api" if this file lives in src/context

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("es_user") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // keep localStorage in sync
  useEffect(() => {
    if (user) localStorage.setItem("es_user", JSON.stringify(user));
    else localStorage.removeItem("es_user");
  }, [user]);

  // on mount, check session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const u = await api.me(); // 200 if logged in, 401 otherwise
        if (!cancelled && u?.email) setUser({ id: u.id, email: u.email });
      } catch (e) {
        // treat 401 as "logged out"
        if (!cancelled) setUser(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const svc = useMemo(
    () => ({
      signUp: (payload) => api.signup(payload),
      signIn: (payload) => api.login(payload),
      signOut: () => api.logout(),
    }),
    []
  );

  const signUp = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await svc.signUp({ email, password });
      // backend returns { id, email }
      setUser({ id: data.id, email: data.email });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password, remember }) => {
    setLoading(true);
    try {
      const data = await svc.signIn({ email, password, remember: !!remember });
      // after login, verify with /me so UI is consistent
      const u = await api.me().catch(() => null);
      if (u?.email) setUser({ id: u.id, email: u.email });
      else setUser({ email }); // fallback
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await svc.signOut();
    } catch {}
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

