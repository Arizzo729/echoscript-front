// src/components/Layout.jsx
import React, { useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EchoAssistantUltra from "./EchoAssistantUltra";
import ToastContainer from "./ToastContainer";
import MobileBottomNav from "./MobileBottomNav";
import IntroVideo from "./IntroVideo";
import { motion, AnimatePresence } from "framer-motion";
import { X, Music2 } from "lucide-react";
import { useSound } from "../context/SoundContext";

// 🌗 Theme Context
export const ThemeContext = createContext();

function AmbientToggleButton() {
  const { toggleAmbient, nowPlaying } = useSound();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-zinc-800/80 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg">
      <button
        onClick={toggleAmbient}
        className="flex items-center gap-2 text-sm font-semibold hover:text-teal-400 transition"
      >
        <Music2 size={18} />
        <span>Cycle Music</span>
      </button>
      <span className="text-xs text-zinc-300">Now: {nowPlaying}</span>
    </div>
  );
}

export default function Layout() {
  // show intro video once on login
  const [showIntro, setShowIntro] = useState(true);

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

  // prevent body scroll during intro
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showIntro]);

  const handleIntroFinish = () => setShowIntro(false);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Intro Video */}
      {showIntro && <IntroVideo src="/videos/intro.mp4" onFinish={handleIntroFinish} />}

      {/* Main App Layout (hidden under intro) */}
      {!showIntro && (
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

          {/* 🎵 Ambient Toggle */}
          <AmbientToggleButton />

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
      )}
    </ThemeContext.Provider>
  );
}

