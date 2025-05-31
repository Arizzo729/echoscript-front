import React, { useState, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EchoAssistantUltra from "./EchoAssistantUltra";
import ToastContainer from "./ToastContainer";
import MobileBottomNav from "./MobileBottomNav";
import { AnimatePresence, motion } from "framer-motion";

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
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 z-50 bg-white dark:bg-zinc-900 p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <button
              onClick={toggleTheme}
              className="w-full px-4 py-2 mb-4 rounded bg-teal-600 text-white hover:bg-teal-500"
            >
              Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
            <button
              onClick={onClose}
              className="text-sm text-teal-500 hover:underline"
            >
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function Layout() {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const user = { name: "Echo User", avatar: null };
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to EchoScript", read: false },
    { id: 2, message: "New features have launched!", read: false },
  ]);
  const markAllRead = () => setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user }}>
        <NotificationContext.Provider value={{ notifications, markAllRead }}>
          <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-500">
            {/* Sidebar */}
            <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            {/* Content Area */}
            <div
              className={`flex flex-col transition-all duration-300 ease-in-out w-full ${
                sidebarCollapsed ? "ml-[64px]" : "ml-[240px]"
              }`}
            >
              <Header
                isDarkMode={theme === "dark"}
                onToggleTheme={toggleTheme}
                onSettingsOpen={() => setSettingsOpen(true)}
                sidebarOpen={!sidebarCollapsed}
                setSidebarOpen={setSidebarCollapsed}
              />
              <main className="flex-grow p-4 overflow-y-auto">
                <Outlet />
              </main>
              <MobileBottomNav />
              <ToastContainer />
              <EchoAssistantUltra />
            </div>

            {/* Settings Panel */}
            <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          </div>
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

