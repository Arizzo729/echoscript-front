
import React, { useState, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer"; // ✅ optional if Footer exists

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-30"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-80 h-full bg-background-light dark:bg-background-dark shadow-xl z-40 p-6 flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Theme</h3>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-md bg-primary text-background-light hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
              </button>
            </section>
            <button
              onClick={onClose}
              className="mt-auto px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-background-light transition"
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
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const [user] = useState({ name: "Andrew R.", avatar: null });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to EchoScript!", read: false, time: "Just now" },
    { id: 2, message: "Your subscription will renew soon.", read: false, time: "2 days ago" },
    { id: 3, message: "New features have been added.", read: true, time: "1 week ago" },
  ]);
  const markAllRead = () =>
    setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user }}>
        <NotificationContext.Provider value={{ notifications, markAllRead }}>
          <div className="flex min-h-screen w-full flex-col bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-500 ease-in-out">
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              user={user}
              onLogout={() => console.log("Logout clicked")}
              onSearch={(query) => console.log("Search:", query)}
              notifications={notifications}
              onToggleTheme={toggleTheme}
              isDarkMode={theme === "dark"}
            />
            <main className="flex-1 min-h-screen w-full">
              <Outlet />
            </main>
            <Footer />
            <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          </div>
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
