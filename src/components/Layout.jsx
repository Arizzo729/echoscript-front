<<<<<<< Updated upstream
// src/components/Layout.jsx
import React, {
  useState,
  useEffect,
  createContext,
  useMemo,
  Suspense,
  lazy,
  useTransition
} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ErrorBoundary from './ErrorBoundary';
import { ToastProvider } from './toast/ToastProvider';
import ToastContainer from './ToastContainer';
import useIsMobile from '../hooks/useIsMobile';
import MobileLayout from './MobileLayout';
import AudioOverlay from './AudioOverlay'; // desktop overlay

const Header = lazy(() => import('./Header'));
const Sidebar = lazy(() => import('./Sidebar'));

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export default function Layout() {
  const isMobile = useIsMobile();
  const location = useLocation();                // <<— replaces useNavigation()
  const [theme, setTheme] = useState(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('theme');
    if (stored) return stored;
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    );
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isPending] = useTransition();

  // simple route-change flag for loading overlay (paired with NProgress)
  const [routeChanging, setRouteChanging] = useState(false);

  useEffect(() => {
    NProgress.configure({ showSpinner: false, easing: 'ease', speed: 400, trickleSpeed: 150 });
  }, []);

  // Kick off NProgress & a brief overlay any time the URL changes
  useEffect(() => {
    setRouteChanging(true);
    NProgress.start();
    const t = setTimeout(() => {
      setRouteChanging(false);
      NProgress.done();
    }, 400); // small delay to avoid flicker on fast routes
    return () => clearTimeout(t);
  }, [location.pathname, location.search, location.hash]);

  // Also finish NProgress if a React transition finishes (rarely needed, harmless)
  useEffect(() => {
    if (!isPending) NProgress.done();
  }, [isPending]);

  // Ensure no scroll lock at layout mount
  useEffect(() => {
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  // Mobile layout delegates everything
  if (isMobile) {
    return (
      <ToastProvider>
        <ThemeContext.Provider value={themeValue}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-zinc-900 focus:text-white focus:px-3 focus:py-2 focus:rounded-md"
          >
            Skip to main content
          </a>
          <MobileLayout>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </MobileLayout>
          <ToastContainer position="top-right" />
        </ThemeContext.Provider>
      </ToastProvider>
    );
  }

  // Desktop layout
  return (
    <ToastProvider>
      <ThemeContext.Provider value={themeValue}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-zinc-900 focus:text-white focus:px-3 focus:py-2 focus:rounded-md"
        >
          Skip to main content
        </a>

        <div className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0a0f1f] via-[#040711] to-[#050a15] text-white">
          <Suspense fallback={<div className="h-16 w-full bg-zinc-900" />}>
            <Header
              collapseSidebar={() => setSidebarCollapsed(v => !v)}
              sidebarCollapsed={sidebarCollapsed}
            />
          </Suspense>

          <div className="flex flex-1 overflow-hidden">
            <Suspense fallback={<div className="w-20 bg-zinc-900" />}>
              <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
              />
            </Suspense>

            <main
              id="main-content"
              className={`flex-1 overflow-y-auto relative px-6 py-4 transition-all duration-300 ${
                sidebarCollapsed ? 'pl-20' : 'pl-56'
              }`}
              tabIndex={0}
              role="main"
              aria-label="Main content"
            >
              {(routeChanging || isPending) && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-40" aria-live="polite">
                  <motion.div
                    aria-label="Loading"
                    role="status"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full"
                  />
                </div>
              )}

              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>
          </div>

          {/* floating, draggable, collapsible audio overlay for desktop */}
          <AudioOverlay />

          <ToastContainer position="top-right" />
        </div>
      </ThemeContext.Provider>
    </ToastProvider>
=======
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
>>>>>>> Stashed changes
  );
}
