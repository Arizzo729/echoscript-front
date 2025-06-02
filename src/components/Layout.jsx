import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EchoAssistantUltra from "./EchoAssistantUltra";
import ToastContainer from "./ToastContainer";
import MobileBottomNav from "./MobileBottomNav";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "../context/useTheme";
import useIsMobile from "../hooks/useIsMobile";

export default function Layout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const isMobile = useIsMobile();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className={`relative flex flex-col h-screen w-screen ${theme === "dark" ? "dark bg-gray-950" : "bg-white"}`}>
      {/* Top header */}
      <Header toggleDrawer={toggleDrawer} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar only on desktop */}
        {!isMobile && <Sidebar />}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6">
          <Outlet />
        </main>
      </div>

      {/* Echo AI assistant */}
      <EchoAssistantUltra />

      {/* Mobile navigation */}
      {isMobile && <MobileBottomNav />}

      {/* Toasts */}
      <ToastContainer />

      {/* Optional settings drawer animation (for future use) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg z-[9999]"
          >
            <button onClick={toggleDrawer} className="p-4 text-right w-full">
              ✕
            </button>
            <div className="p-6">
              <h2 className="text-xl font-semibold">Settings</h2>
              {/* Add your settings content here */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

