import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Bell, Globe, Info } from "lucide-react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <motion.div
      className="p-8 max-w-4xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2">
              <Sun size={18} />
              Appearance
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose light or dark mode.
            </p>
          </div>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              darkMode ? "bg-primary text-white" : "bg-gray-200"
            }`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2">
              <Bell size={18} />
              Notifications
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive email updates about transcript results.
            </p>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={emailAlerts}
            onChange={() => setEmailAlerts(!emailAlerts)}
          />
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2">
          <Globe size={18} />
          Language
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Choose your preferred language:</p>
        <select className="w-full mt-1 p-2 rounded border bg-gray-50 dark:bg-gray-800 dark:text-white">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>Arabic</option>
        </select>
      </div>
    </motion.div>
  );
}
