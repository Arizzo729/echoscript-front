import React, { useState, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./global.css";

const ThemeContext = createContext();
const UserContext = createContext();
const NotificationContext = createContext();

const SettingsDrawer = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed top-0 right-0 z-50 w-80 h-full bg-background-light dark:bg-background-dark shadow-2xl p-6 flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Theme</h3>
              <button
                onClick={toggleTheme}
                className="w-full px-4 py-2 rounded-md bg-primary text-white dark:text-black hover:bg-primary-dark transition"
              >
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
              </button>
            </section>
            <button
              onClick={onClose}
              className="mt-auto px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition"
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
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const [user] = useState({ name: "Andrew R.", avatar: null });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to EchoScript!", read: false, time: "Just now" },
    { id: 2, message: "Your subscription will renew soon.", read: false, time: "2 days ago" },
    { id: 3, message: "New features have been added.", read: true, time: "1 week ago" },
  ]);
  const markAllRead = () => setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user }}>
        <NotificationContext.Provider value={{ notifications, markAllRead }}>
          <div className="relative min-h-screen w-full overflow-x-hidden bg-transparent transition-colors duration-500 ease-in-out">

            {/* 🌫 Ambient Layers */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-50 via-sky-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 pointer-events-none" />
            <div className="absolute inset-0 z-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />

            {/* 🧱 Main Layout */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                user={user}
                onLogout={() => console.log("Logout clicked")}
                onSearch={(query) => console.log("Search:", query)}
                notifications={notifications}
                onToggleTheme={toggleTheme}
                isDarkMode={theme === "dark"}
                onSettingsOpen={() => setSettingsOpen(true)}
              />

              <motion.main
                className="flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Outlet />
              </motion.main>

              <Footer />
              <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
            </div>
          </div>
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

