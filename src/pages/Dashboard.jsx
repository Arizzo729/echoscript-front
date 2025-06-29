import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  UploadCloud,
  FileText,
  Sparkles,
  Video,
  Clock,
  User,
  Settings2,
} from "lucide-react";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = {
    name: "Guest Echo",
    email: "guest@echoscript.ai",
    plan: "Guest Plan",
    minutesUsed: 0,
    sessions: 0,
    limit: 60,
    isGuest: true,
  };

  const percentUsed = Math.min((user.minutesUsed / user.limit) * 100, 100);

  const sections = [
    { icon: <Mic />, label: "Upload Audio", route: "/upload", color: "from-teal-500 to-teal-700" },
    { icon: <FileText />, label: "Transcripts", route: "/transcripts", color: "from-indigo-500 to-indigo-700" },
    { icon: <Sparkles />, label: "Summarize", route: "/summary", color: "from-purple-500 to-purple-700" },
    { icon: <Video />, label: "Video Upload", route: "/video", color: "from-rose-500 to-rose-700" },
    { icon: <Clock />, label: "History", route: "/history", color: "from-yellow-400 to-yellow-600" },
    { icon: <Settings2 />, label: "Settings", route: "/settings", color: "from-zinc-600 to-zinc-800" },
  ];

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-10 text-white tracking-tight">
        Welcome back, <span className="text-teal-400">{user.name}</span> 👋
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {sections.map(({ icon, label, route, color }) => (
          <DashboardCard key={label} icon={icon} label={label} color={color} onClick={() => navigate(route)} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <motion.div
          className="rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            📈 Usage Summary
          </h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li><strong className="text-white">Plan:</strong> {user.plan}</li>
            <li><strong className="text-white">Minutes Used:</strong> {user.minutesUsed} / {user.limit}</li>
            <li><strong className="text-white">Sessions:</strong> {user.sessions}</li>
          </ul>
          <div className="mt-5 h-3 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"
              style={{ width: `${percentUsed}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${percentUsed}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
          <p className="text-right text-xs text-zinc-500 mt-2 italic">
            {percentUsed.toFixed(1)}% used
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl p-6 flex items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-4 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-md">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {user.name} {user.isGuest && `(Guest User)`}
            </p>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-5 p-5 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-teal-300" />
          <p className="text-sm text-teal-300 font-medium">Pro Tip</p>
        </div>
        <p className="text-sm text-zinc-400">
          Upload clear audio for the best transcription quality. Try upgrading your plan to unlock more features!
        </p>
      </div>
    </motion.div>
  );
}

function DashboardCard({ icon, label, color, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex justify-between items-center w-full p-5 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white transition-all group`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white bg-opacity-20 rounded-full text-white shadow-md">
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <span className="text-md font-semibold">{label}</span>
      </div>
      <span className="text-sm text-white/70 group-hover:translate-x-1 transition-transform">→</span>
    </motion.button>
  );
}


