import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  LogOut,
  Settings,
  User,
  BarChart2,
  FileText,
  UploadCloud,
  AlertCircle,
  Moon,
  Sun
} from "lucide-react";

export default function Account() {
  const [user, setUser] = useState({
    name: "Echo User",
    email: "user@example.com",
    plan: "Pro",
    minutesUsed: 227,
    sessions: 15,
    darkMode: false,
  });

  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    setTranscripts([
      {
        id: 1,
        title: "Podcast with John",
        date: "2025-05-25",
        summary: "Discussed AI, business, and startup trends.",
        format: "MP3",
        size: "24MB",
      },
      {
        id: 2,
        title: "Sales Meeting",
        date: "2025-05-22",
        summary: "Client call outlining sales roadmap.",
        format: "WAV",
        size: "13MB",
      },
    ]);
  }, []);

  const toggleDarkMode = () => {
    setUser({ ...user, darkMode: !user.darkMode });
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-primary-light">Account Overview</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:underline"
          >
            {user.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {user.darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="flex items-center gap-2 text-sm text-red-500 hover:underline">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Profile and Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-700 shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">👤 Profile</h2>
          <p className="text-gray-600 dark:text-gray-300"><strong>Name:</strong> {user.name}</p>
          <p className="text-gray-600 dark:text-gray-300"><strong>Email:</strong> {user.email}</p>
          <p className="text-gray-600 dark:text-gray-300"><strong>Plan:</strong> {user.plan}</p>
          <button className="mt-3 text-primary dark:text-primary-light text-sm hover:underline">Manage Plan</button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-700 shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">📊 Usage</h2>
          <p className="text-gray-600 dark:text-gray-300"><strong>Minutes Used:</strong> {user.minutesUsed}</p>
          <p className="text-gray-600 dark:text-gray-300"><strong>Sessions:</strong> {user.sessions}</p>
          <button className="mt-3 text-primary dark:text-primary-light text-sm hover:underline">Upgrade Limits</button>
        </div>
      </div>

      {/* Transcript History */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Saved Transcripts
        </h3>
        {transcripts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">You haven’t saved any transcripts yet.</p>
        ) : (
          <div className="space-y-4">
            {transcripts.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4 hover:shadow transition"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.date} • {t.format} • {t.size}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t.summary}</p>
                </div>
                <button className="flex items-center gap-1 text-sm text-primary dark:text-primary-light hover:underline">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard icon={<Settings className="w-5 h-5" />} label="Preferences" />
        <ActionCard icon={<UploadCloud className="w-5 h-5" />} label="Upload History" />
        <ActionCard icon={<BarChart2 className="w-5 h-5" />} label="Billing Dashboard" />
        <ActionCard icon={<User className="w-5 h-5" />} label="Edit Profile" />
        <ActionCard icon={<AlertCircle className="w-5 h-5" />} label="Report a Problem" />
      </div>
    </motion.div>
  );
}

function ActionCard({ icon, label }) {
  return (
    <button className="flex items-center justify-between w-full p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
      <div className="flex items-center gap-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
        {icon}
        {label}
      </div>
      <span className="text-xs text-gray-400">→</span>
    </button>
  );
}
