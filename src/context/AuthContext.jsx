import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : { guest: true };
  });

  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);

  // Determine guest mode
  const isGuest = user?.guest === true || !token;
  const hasLimits = isGuest;

  // 🔐 Login Function
  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || "Login failed");
    }

    const data = await res.json();
    localStorage.setItem("authToken", data.access_token);
    localStorage.setItem("authUser", JSON.stringify({ email, guest: false }));

    setUser({ email, guest: false });
    setToken(data.access_token);
  };

  // 📝 Register and auto-login
  const register = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || "Registration failed");
    }

    return login(email, password); // auto-login
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser({ guest: true });
    setToken(null);
  };

  // 🔁 Sync guest fallback
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
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

