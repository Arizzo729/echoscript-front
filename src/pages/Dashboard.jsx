import React from "react";
import { motion } from "framer-motion";
import {
  Mic,
  UploadCloud,
  FileText,
  Sparkles,
  Video,
  Clock,
  BarChart2,
  User,
} from "lucide-react";

export default function Dashboard() {
  const user = {
    name: "Echo User",
    email: "user@example.com",
    plan: "Pro",
    minutesUsed: 227,
    sessions: 15,
    limit: 1000,
  };

  const percentUsed = Math.min((user.minutesUsed / user.limit) * 100, 100);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-primary dark:text-primary-light">
        Welcome back, {user.name.split(" ")[0]} 👋
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <DashboardCard icon={<Mic />} label="New Recording" color="bg-teal-100 dark:bg-teal-900" />
        <DashboardCard icon={<UploadCloud />} label="Upload Audio" color="bg-blue-100 dark:bg-blue-900" />
        <DashboardCard icon={<FileText />} label="Saved Transcripts" color="bg-indigo-100 dark:bg-indigo-900" />
        <DashboardCard icon={<Sparkles />} label="GPT Summary" color="bg-purple-100 dark:bg-purple-900" />
        <DashboardCard icon={<Video />} label="Transcribe Video" color="bg-rose-100 dark:bg-rose-900" />
        <DashboardCard icon={<Clock />} label="History" color="bg-yellow-100 dark:bg-yellow-900" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-white">
            📊 Usage Snapshot
          </h2>
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <p><strong>Plan:</strong> {user.plan}</p>
            <p><strong>Minutes Used:</strong> {user.minutesUsed} / {user.limit}</p>
            <p><strong>Sessions:</strong> {user.sessions}</p>
          </div>
          <div className="mt-4 h-3 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-xl border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-white">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-medium text-zinc-800 dark:text-white">{user.name}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{user.email}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardCard({ icon, label, color }) {
  return (
    <motion.button
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center justify-between w-full p-5 rounded-lg border border-transparent dark:border-zinc-700 ${color} hover:brightness-105 transition`}
    >
      <div className="flex items-center gap-4 text-left text-md font-medium text-zinc-800 dark:text-zinc-100">
        <span className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md">
          {icon}
        </span>
        {label}
      </div>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">→</span>
    </motion.button>
  );
}

