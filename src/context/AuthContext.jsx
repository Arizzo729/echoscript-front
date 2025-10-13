// src/context/AuthContext.jsx
<<<<<<< Updated upstream
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Load session once on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await api.me();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function signIn({ email, password, remember }) {
    const res = await api.login({ email, password, remember });
    // immediately refresh me so context has {id,email,...}
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      // fallback: synthesize from payload if /me not present
      setUser({ email: res?.email || email, id: res?.id, mode: "jwt" });
    }
  }

  async function signOut() {
    try { await api.logout(); } finally { setUser(null); }
  }

  async function refresh() {
    const me = await api.me();
    setUser(me);
  }

  const value = useMemo(() => ({
    user,
    ready,
    signIn,
    signOut,
    refresh,
    isAuthenticated: !!user?.email,
  }), [user, ready]);

  return (
    <AuthContext.Provider value={value}>
=======
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";

const AuthContext = createContext();

// Custom hook to consume AuthContext
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const API_BASE = import.meta.env.VITE_API_BASE || "";

  // --- state
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser]   = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const isGuest  = !token;
  const hasLimits = isGuest;

  // --- persist token & user
  useEffect(() => {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    else localStorage.removeItem("authUser");
  }, [user]);

  // --- wrapped fetch
  const authedFetch = useCallback(
    (url, opts = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opts.headers,
      };
      return fetch(`${API_BASE}${url}`, { ...opts, headers });
    },
    [token, API_BASE]
  );

  // --- bootstrap: load current user if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authedFetch("/auth/me");
        if (!res.ok) throw new Error("Session expired");
        const me = await res.json();
        setUser(me);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token, authedFetch]);

  // --- sign in
  const signIn = useCallback(
    async ({ email, password, remember = false }) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: email,
            password,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Login failed");

        setToken(data.access_token);
        setUser({ email, verified: true });
        if (remember) localStorage.setItem("authToken", data.access_token);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE]
  );

  // --- sign up (register)
  const signUp = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Registration failed");
        return data; // probably a verification message
      } finally {
        setLoading(false);
      }
    },
    [API_BASE]
  );

  // --- verify email & get JWT
  const verifyEmail = useCallback(
    async ({ email, code, remember = false }) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Verification failed");

        setToken(data.access_token);
        setUser({ email, verified: true });
        if (remember) localStorage.setItem("authToken", data.access_token);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE]
  );

  // --- logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isGuest,
        hasLimits,
        loading,
        authedFetch,
        signIn,
        signUp,
        verifyEmail,
        logout,
      }}
    >
>>>>>>> Stashed changes
      {children}
    </AuthContext.Provider>
  );
}
<<<<<<< Updated upstream

export function useAuth() {
  return useContext(AuthContext);
}

=======
>>>>>>> Stashed changes
