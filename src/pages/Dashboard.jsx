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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-primary-light">Account Overview</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 text-sm px-3 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-full hover:scale-105 transition"
          >
            {user.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {user.darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="flex items-center gap-2 text-sm px-3 py-1 bg-red-500 text-white rounded-full hover:scale-105 transition">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border dark:border-zinc-700 shadow">
          <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-white">👤 Profile</h2>
          <p className="text-zinc-600 dark:text-zinc-300"><strong>Name:</strong> {user.name}</p>
          <p className="text-zinc-600 dark:text-zinc-300"><strong>Email:</strong> {user.email}</p>
          <p className="text-zinc-600 dark:text-zinc-300"><strong>Plan:</strong> {user.plan}</p>
          <button className="mt-3 text-teal-500 hover:underline text-sm">Manage Plan</button>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border dark:border-zinc-700 shadow">
          <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-white">📊 Usage</h2>
          <p className="text-zinc-600 dark:text-zinc-300"><strong>Minutes Used:</strong> {user.minutesUsed}</p>
          <p className="text-zinc-600 dark:text-zinc-300"><strong>Sessions:</strong> {user.sessions}</p>
          <button className="mt-3 text-teal-500 hover:underline text-sm">Upgrade Limits</button>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Saved Transcripts
        </h3>
        {transcripts.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">You haven’t saved any transcripts yet.</p>
        ) : (
          <div className="space-y-4">
            {transcripts.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-md p-4 hover:shadow transition"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{t.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.date} • {t.format} • {t.size}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{t.summary}</p>
                </div>
                <button className="flex items-center gap-1 text-sm text-teal-500 hover:underline">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
    <button className="flex items-center justify-between w-full p-4 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
      <div className="flex items-center gap-3 text-left text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {icon}
        {label}
      </div>
      <span className="text-xs text-zinc-400">→</span>
    </button>
  );
}
