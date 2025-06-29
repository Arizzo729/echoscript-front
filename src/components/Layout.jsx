// ✅ EchoScript.AI: Final Unified Layout — Assistant Visible on Mobile
import React, { useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EchoAssistantUltra from "./EchoAssistantUltra";
import ToastContainer from "./ToastContainer";
import MobileBottomNav from "./MobileBottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// 🌗 Theme Context (Global)
export const ThemeContext = createContext();

export default function Layout() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0a0f1f] via-[#040711] to-[#050a15] text-white">

        {/* 📌 Header */}
        <Header
          toggleDrawer={toggleDrawer}
          onToggleTheme={toggleTheme}
          isDarkMode={theme === "dark"}
        />

        {/* 🧭 Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main
            className={`flex-1 overflow-y-auto transition-all duration-300 px-4 py-4 md:px-8 md:py-6 ${
              collapsed ? "md:pl-20" : "md:pl-56"
            }`}
          >
            <Outlet />
          </main>
        </div>

        {/* 🤖 Echo Assistant */}
        <EchoAssistantUltra />

        {/* 📱 Mobile Bottom Navigation */}
        <div className="md:hidden">
          <MobileBottomNav />
        </div>

        {/* 🔔 Toast Notifications */}
        <ToastContainer />

        {/* ⚙️ Settings Drawer */}
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-[9999] h-full w-80 bg-white dark:bg-zinc-900 shadow-lg"
            >
              <button
                onClick={toggleDrawer}
                className="absolute top-4 right-4 text-zinc-600 dark:text-zinc-300 hover:text-teal-500 transition"
                aria-label="Close drawer"
              >
                <X size={20} />
              </button>
              <div className="p-6 mt-10">
                <h2 className="text-xl font-semibold">Settings</h2>
                {/* Insert actual settings UI here */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
}
