// ✅ EchoScript.AI: Layout.jsx — Responsive, Animated, and Smart UI Container
import React, { useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EchoAssistantUltra from "./EchoAssistantUltra";
import ToastContainer from "./ToastContainer";
import MobileBottomNav from "./MobileBottomNav";
import useIsMobile from "../hooks/useIsMobile";

export const ThemeContext = createContext();
export const UserContext = createContext();
export const NotificationContext = createContext();
export const FontSizeContext = createContext();

export default function Layout() {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const isMobile = useIsMobile();

  const user = { name: "Echo User", avatar: null };
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to EchoScript", read: false },
    { id: 2, message: "New features have launched!", read: false },
  ]);
  const markAllRead = () =>
    setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));

  const [fontSize, setFontSize] = useState(1);
  const MIN_FONT_SCALE = 0.85;
  const MAX_FONT_SCALE = 1.25;
  const clampedFontSize = Math.min(Math.max(fontSize, MIN_FONT_SCALE), MAX_FONT_SCALE);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user }}>
        <NotificationContext.Provider value={{ notifications, markAllRead }}>
          <FontSizeContext.Provider value={{ fontSize: clampedFontSize, setFontSize }}>
            <div
              className={`flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-all duration-300 ease-in-out`}
              style={{ fontSize: `${clampedFontSize}em` }}
            >
              {/* Sidebar (desktop only) */}
              {!isMobile && <Sidebar />}

              {/* Main Content Area */}
              <div className="flex flex-col flex-grow">
                <Header isDarkMode={theme === "dark"} onToggleTheme={toggleTheme} />

                <main className="flex-grow overflow-y-auto px-6 py-4 bg-transparent">
                  <Outlet />
                </main>

                {/* Footer & Assistant */}
                {isMobile && <MobileBottomNav />}
                <ToastContainer />
                <EchoAssistantUltra />
              </div>
            </div>
          </FontSizeContext.Provider>
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

