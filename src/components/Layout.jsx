// ✅ EchoScript.AI: Final Unified Layout — Gradient Background + Cinematic SVG Glow Trail
import React, { useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EchoAssistantUltra from "./EchoAssistantUltra";
import ToastContainer from "./ToastContainer";
import MobileBottomNav from "./MobileBottomNav";
import GlowSVGTrail from "./GlowSVGTrail"; // 🔥 Final active glow trail
import { AnimatePresence, motion } from "framer-motion";

export const ThemeContext = createContext();

export default function Layout() {
  const [theme, setTheme] = useState("dark");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // Sidebar starts collapsed

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="relative flex flex-col h-screen w-screen bg-gradient-to-br from-[#0a0f1f] via-[#040711] to-[#050a15] text-white overflow-hidden">
        {/* ✨ Final Glow Trail */}
        <GlowSVGTrail />

        {/* 📌 Top Header */}
        <Header toggleDrawer={toggleDrawer} />

        {/* 🧭 Sidebar + Page Content */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main
            className={`flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6 transition-all duration-300 ${
              collapsed ? "md:pl-20" : "md:pl-56"
            }`}
          >
            <Outlet />
          </main>
        </div>

        {/* 🤖 Assistant + 📱 Mobile Nav */}
        <div className="hidden md:block">
          <EchoAssistantUltra />
        </div>
        <div className="md:hidden">
          <MobileBottomNav />
        </div>

        {/* 🔔 Toast Notifications */}
        <ToastContainer />

        {/* ⚙️ Slide-in Settings Panel */}
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg z-[9999]"
            >
              <button
                onClick={toggleDrawer}
                className="p-4 text-right w-full text-zinc-600 dark:text-zinc-300 hover:text-teal-500 transition"
              >
                ✕
              </button>
              <div className="p-6">
                <h2 className="text-xl font-semibold">Settings</h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
}
