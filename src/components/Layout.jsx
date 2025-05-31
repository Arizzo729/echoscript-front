// Layout.jsx — Final EchoScript.AI Layout with Sidebar, Header, Theme, Settings, and Notifications

import React, { useState, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiSettings, FiLogOut } from "react-icons/fi";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ToastContainer from "./components/ToastContainer";
import EchoAssistantUltra from "./components/EchoAssistantUltra";
import MobileBottomNav from "./components/MobileBottomNav";

export const ThemeContext = createContext();
export const UserContext = createContext();
export const NotificationContext = createContext();

const SettingsDrawer = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 w-80 h-full bg-white dark:bg-zinc-900 z-50 p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">⚙️ Settings</h2>
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">Theme</p>
              <button
                onClick={toggleTheme}
                className="w-full px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600"
              >
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
              </button>
            </div>
            <button
              onClick={onClose}
              className="mt-auto text-sm text-teal-500 hover:underline"
            >
              Close Settings
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function Layout() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to EchoScript.AI", read: false },
    { id: 2, message: "New features are now live!", read: false },
  ]);
  const markAllRead = () => setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));

  const user = { name: "Echo Guest", avatar: null };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user }}>
        <NotificationContext.Provider value={{ notifications, markAllRead }}>
          <div className="flex min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300">
            
            {/* ✅ Sidebar */}
            <Sidebar />

            {/* ✅ Main Panel */}
            <div className="flex flex-col flex-1 relative">
              <Header
                onToggleTheme={toggleTheme}
                onSettingsOpen={() => setSettingsOpen(true)}
                isDarkMode={theme === "dark"}
              />
              
              <main className="flex-grow overflow-y-auto px-6 py-4">
                <Outlet />
              </main>

              <MobileBottomNav />
              <ToastContainer />
              <EchoAssistantUltra />
            </div>

            <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          </div>
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
