import React from "react";
import { motion } from "framer-motion";
import {
  Mic,
  UploadCloud,
  FileText,
  Sparkles,
  Video,
  Clock,
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
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-white">Welcome back, {user.name.split(" ")[0]} 👋</h1>

      {/* 🔧 Tool Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Mic />, label: "New Recording", color: "from-teal-500 to-teal-700" },
          { icon: <UploadCloud />, label: "Upload Audio", color: "from-blue-500 to-blue-700" },
          { icon: <FileText />, label: "Saved Transcripts", color: "from-indigo-500 to-indigo-700" },
          { icon: <Sparkles />, label: "GPT Summary", color: "from-purple-500 to-purple-700" },
          { icon: <Video />, label: "Transcribe Video", color: "from-rose-500 to-rose-700" },
          { icon: <Clock />, label: "History", color: "from-yellow-400 to-yellow-600" },
        ].map(({ icon, label, color }) => (
          <DashboardCard key={label} icon={icon} label={label} color={color} />
        ))}
      </div>

      {/* 📊 Analytics + User Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          className="rounded-xl border dark:border-zinc-700 bg-zinc-900 shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Usage Snapshot</h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li><strong>Plan:</strong> {user.plan}</li>
            <li><strong>Minutes Used:</strong> {user.minutesUsed} / {user.limit}</li>
            <li><strong>Sessions:</strong> {user.sessions}</li>
          </ul>
          <div className="mt-4 h-3 bg-zinc-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 to-blue-500"
              style={{ width: `${percentUsed}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${percentUsed}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
          <p className="text-right text-xs text-zinc-400 mt-2">{percentUsed.toFixed(1)}% used</p>
        </motion.div>

        <motion.div
          className="rounded-xl border dark:border-zinc-700 bg-zinc-900 shadow-xl p-6 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-4 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-md">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user.name}</p>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DashboardCard({ icon, label, color }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`flex justify-between items-center w-full p-5 rounded-xl shadow-md bg-gradient-to-br ${color} text-white transition-all`}
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white bg-opacity-20 rounded-full">{icon}</div>
        <span className="text-md font-medium">{label}</span>
      </div>
      <span className="text-sm">→</span>
    </motion.button>
  );
}


