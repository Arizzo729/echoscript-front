import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

// 🔁 Hook to access auth context safely
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? JSON.parse(stored) : { guest: true };
    } catch {
      return { guest: true };
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(false);

  const isGuest = !token || user?.guest === true;
  const hasLimits = isGuest;

  // ✅ Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("authUser", JSON.stringify({ email, guest: false }));
      setUser({ email, guest: false });
      setToken(data.access_token);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register and auto-login
  const register = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Registration failed");
      }

      return login(email, password);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser({ guest: true });
    setToken(null);
  };

  // 🛡️ Fallback guest protection
  useEffect(() => {
    if (!token && (!user || !user.guest)) {
      setUser({ guest: true });
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isGuest,
        hasLimits,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

