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
  Sun,
  BadgeCheck,
} from "lucide-react";
import Button from "../components/ui/Button";

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
    const nextMode = !user.darkMode;
    setUser((prev) => ({ ...prev, darkMode: nextMode }));
    document.documentElement.classList.toggle("dark", nextMode);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          👤 Your Account
        </h1>
        <div className="flex gap-3">
          <Button
            onClick={toggleDarkMode}
            size="sm"
            variant="ghost"
            icon={user.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          >
            {user.darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button size="sm" variant="danger" icon={<LogOut className="w-4 h-4" />}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Profile and Usage */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card title="👤 Profile">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p className="flex items-center gap-2">
            <strong>Plan:</strong>
            <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-teal-600 text-white">
              <BadgeCheck className="w-3 h-3 mr-1" />
              {user.plan}
            </span>
          </p>
          <Button size="xs" variant="outline" className="mt-3 hover:border-teal-400 hover:text-teal-400">
            Manage Plan
          </Button>
        </Card>

        <Card title="📊 Usage">
          <p><strong>Minutes Used:</strong> {user.minutesUsed}</p>
          <p><strong>Sessions:</strong> {user.sessions}</p>
          <div className="mt-4">
            <label className="text-sm text-zinc-500 dark:text-zinc-400">Monthly Usage</label>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-3 rounded-full mt-1">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-500 ease-in-out"
                style={{ width: `${Math.min((user.minutesUsed / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Transcripts */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-zinc-800 dark:text-white">
          <FileText className="w-5 h-5 text-blue-500" />
          Saved Transcripts
        </h2>

        {transcripts.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            You haven’t saved any transcripts yet.
          </p>
        ) : (
          <div className="space-y-4">
            {transcripts.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-start bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 dark:text-white">{t.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t.date} • {t.format} • {t.size}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{t.summary}</p>
                  <div className="flex gap-3 mt-2">
                    <Button variant="ghost" size="xs">Copy</Button>
                    <Button variant="ghost" size="xs">Summarize</Button>
                  </div>
                </div>
                <Button variant="ghost" size="xs" icon={<Download className="w-4 h-4" />}>
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <ActionCard icon={<Settings className="w-5 h-5" />} label="Preferences" />
        <ActionCard icon={<UploadCloud className="w-5 h-5" />} label="Upload History" />
        <ActionCard icon={<BarChart2 className="w-5 h-5" />} label="Billing Dashboard" />
        <ActionCard icon={<User className="w-5 h-5" />} label="Edit Profile" />
        <ActionCard icon={<AlertCircle className="w-5 h-5" />} label="Report a Problem" />
      </div>

      {/* Activity Log */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-white mb-4">
          🕓 Recent Activity
        </h2>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          <li>🟢 Transcribed “Client Brief” – 3 minutes ago</li>
          <li>🟡 Uploaded “Investor Call.wav” – 2 days ago</li>
          <li>🔵 Downloaded summary of “Tech Weekly” – 1 week ago</li>
        </ul>
      </div>
    </motion.div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border dark:border-zinc-700 shadow-md space-y-2">
      <h3 className="text-lg font-semibold mb-2 bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">{children}</div>
    </div>
  );
}

function ActionCard({ icon, label }) {
  return (
    <button
      className="flex items-center justify-between w-full p-4 rounded-xl border dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/90 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all backdrop-blur-sm"
      title={label}
    >
      <div className="flex items-center gap-3 text-left text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {icon}
        {label}
      </div>
      <span className="text-xs text-zinc-400">→</span>
    </button>
  );
}


