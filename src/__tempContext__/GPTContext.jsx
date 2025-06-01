// 6. GPTContext.jsx (Persistent memory ready)
import React, { createContext, useState } from "react";

export const GPTContext = createContext();

export function GPTProvider({ children }) {
  const [user, setUser] = useState(() => localStorage.getItem("user") || null);
  const [contextMessage, setContextMessage] = useState("");

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("user", data);
  };

  return (
    <GPTContext.Provider value={{ user, setUser: updateUser, contextMessage, setContextMessage }}>
      {children}
    </GPTContext.Provider>
  );
}
