// src/Layout.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EchoAssistantUltra from "./EchoAssistantUltra";
import ToastContainer from "./ToastContainer";
import MobileBottomNav from "./MobileBottomNav";

export const ThemeContext = createContext();
export const UserContext = createContext();
export const NotificationContext = createContext();

export default function Layout() {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = { name: "Echo User", avatar: null };
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to EchoScript", read: false },
    { id: 2, message: "New features have launched!", read: false },
  ]);
  const markAllRead = () =>
    setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user }}>
        <NotificationContext.Provider value={{ notifications, markAllRead }}>
          <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Right Content */}
            <div
              className={`flex flex-col flex-grow transition-all duration-300 ${
                sidebarOpen ? "pl-[240px]" : "pl-[64px]"
              }`}
            >
              {/* Header */}
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isDarkMode={theme === "dark"}
                onToggleTheme={toggleTheme}
              />

              {/* Main Content */}
              <main className="flex-grow overflow-y-auto p-4">
                <Outlet />
              </main>

              {/* Utilities */}
              <MobileBottomNav />
              <ToastContainer />
              <EchoAssistantUltra />
            </div>
          </div>
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

