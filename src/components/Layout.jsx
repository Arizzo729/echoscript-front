// ✅ Upgraded Layout.jsx for EchoScript.AI — Full UI + Context Integration

import React, { useState, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";

const ThemeContext = createContext();
const UserContext = createContext();
const NotificationContext = createContext();

const NotificationDropdown = () => {
  const { notifications, markAllRead } = useContext(NotificationContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-primary-light dark:hover:bg-primary-dark transition"
      >
        <FiBell className="text-xl" />
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-md bg-background-light dark:bg-background-dark shadow-lg border border-border-default dark:border-border-dark z-20"
          >
            <div className="p-4 flex justify-between items-center border-b border-border-default dark:border-border-dark">
              <h4 className="font-semibold text-lg">Notifications</h4>
              <button
                onClick={markAllRead}
                className="text-sm text-primary hover:underline"
              >
                Mark all read
              </button>
            </div>
            <ul>
              {notifications.length === 0 ? (
                <li className="p-4 text-center text-muted">No notifications</li>
              ) : (
                notifications.map(({ id, message, read }) => (
                  <li
                    key={id}
                    className={`px-4 py-2 border-b text-sm border-border-default dark:border-border-dark select-none ${
                      read
                        ? "bg-background-light dark:bg-background-dark"
                        : "bg-primary-light dark:bg-primary-dark text-background-light"
                    }`}
                  >
                    {message}
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
    { id: 1, message: "Welcome to EchoScript!", read: false },
    { id: 2, message: "Your subscription will renew soon.", read: false },
    { id: 3, message: "New features have been added.", read: true },
  ]);
  const markAllRead = () => setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user }}>
        <NotificationContext.Provider value={{ notifications, markAllRead }}>
          <div className="flex min-h-screen w-full flex-col bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-500 ease-in-out">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background-light px-4 dark:border-border-dark dark:bg-background-dark">
              <FiMenu className="text-2xl" />
              <h1 className="text-xl font-bold">EchoScript.AI</h1>
              <div className="ml-auto flex items-center gap-4">
                <NotificationDropdown />
                <div className="relative">
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="h-9 w-9 rounded-full bg-primary-light dark:bg-primary-dark flex items-center justify-center text-primary-dark dark:text-primary-light font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 p-4">
              <Outlet />
            </main>

            <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          </div>
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
