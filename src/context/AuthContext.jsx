import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

/**
 * Base URL handling:
 * - If VITE_API_BASE or VITE_API_BASE_URL is set (e.g., your Cloudflare tunnel),
 *   we call that directly (https://...trycloudflare.com).
 * - Otherwise we call same-origin "/api/..." so Netlify redirects can proxy it.
 */
const RAW_BASE =
  (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || "").trim();
const API_BASE = RAW_BASE.replace(/\/+$/, ""); // strip trailing slashes

function buildUrl(path) {
  // Ensure a single leading slash for the API prefix
  const absolutePath = path.startsWith("/") ? path : `/${path}`;
  if (API_BASE) return `${API_BASE}${absolutePath}`;   // e.g. https://tunnel/api/...
  return absolutePath;                                 // e.g. /api/...
}

// Centralized JSON POST helper with basic error surfacing
async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload ?? {}),
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { detail: text }; }
  if (!res.ok) {
    const msg = data?.detail || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("es_user") || "null"); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // Persist lightweight user snapshot (email only by default)
  useEffect(() => {
    if (user) localStorage.setItem("es_user", JSON.stringify(user));
    else localStorage.removeItem("es_user");
  }, [user]);

  const api = useMemo(() => {
    // Your backend auth router uses prefix "/api/auth"
    // so we normalize all endpoints here with a *leading slash*.
    return {
      signUp: (payload) => postJson(buildUrl("/api/auth/register"), payload),
      signIn: (payload) => postJson(buildUrl("/api/auth/login"), payload),
      verifyEmail: (payload) => postJson(buildUrl("/api/auth/verify"), payload),
      signOut: () => postJson(buildUrl("/api/auth/logout"), {}),
    };
  }, []);

  const signUp = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await api.signUp({ email, password });
      // Some backends return tokens; some just 200 OK → set minimal user state
      setUser({ email, ...("user" in data ? data.user : {}) });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password, remember }) => {
    setLoading(true);
    try {
      const data = await api.signIn({ email, password, remember: !!remember });
      // Save tokens if provided
      if (data?.access_token) localStorage.setItem("es_token", data.access_token);
      if (data?.refresh_token) localStorage.setItem("es_refresh", data.refresh_token);
      setUser({ email, ...("user" in data ? data.user : {}) });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async ({ email, code }) => {
    setLoading(true);
    try {
      const data = await api.verifyEmail({ email, code });
      // Consider verified → keep user (or update flags if backend returns them)
      setUser((u) => ({ ...(u || { email }), verified: true }));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try { await api.signOut(); } catch { /* ignore */ }
    localStorage.removeItem("es_token");
    localStorage.removeItem("es_refresh");
    setUser(null);
  };

  const value = { user, loading, signUp, signIn, verifyEmail, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

