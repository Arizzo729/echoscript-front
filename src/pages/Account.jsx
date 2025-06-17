import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  LogOut,
  Moon,
  Sun,
  BadgeCheck,
  FileText,
} from "lucide-react";
import Button from "../components/ui/Button";

export default function Account() {
  const [user, setUser] = useState({
    name: "Guest Echo",
    email: "guest@echoscript.ai",
    plan: "Guest",
    minutesUsed: 0,
    sessions: 0,
    darkMode: false,
    avatar: "/default-avatar.png",
    isGuest: true,
  });

  const toggleDarkMode = () => {
    const nextMode = !user.darkMode;
    setUser((prev) => ({ ...prev, darkMode: nextMode }));
    document.documentElement.classList.toggle("dark", nextMode);
  };

  return (
    <motion.div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          👤 {user.name}
        </h1>
        <Button
          onClick={toggleDarkMode}
          size="sm"
          variant="ghost"
          icon={user.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        >
          {user.darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card title="👤 Profile Overview">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full border border-zinc-400 dark:border-zinc-600 object-cover"
            />
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-white">{user.name}</p>
              <p className="text-sm text-zinc-400">{user.email}</p>
            </div>
          </div>
          <p className="flex items-center gap-2 text-zinc-300">
            <strong>Plan:</strong>
            <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-zinc-700 text-white">
              <BadgeCheck className="w-3 h-3 mr-1" />
              {user.plan}
            </span>
          </p>
        </Card>

        <Card title="🔒 Why an Account Matters">
          <p>
            Sign in to access premium features like saved transcripts, multi-device syncing,
            advanced analytics, and personalized AI tuning.
          </p>
          <p>
            We respect privacy and never sell data. Human verification protects against spam.
          </p>
        </Card>

        <Card title="📢 Guest Mode Explained">
          <p>
            You’re using EchoScript as a guest. You can try transcription and AI summarizing, but some
            features may be limited or time-restricted.
          </p>
          <p>
            For full access, consider creating a free or Pro account.
          </p>
        </Card>
      </div>
    </motion.div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-zinc-800/80 dark:bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg space-y-2">
      <h3 className="text-lg font-semibold mb-2 bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="text-sm text-zinc-300 space-y-1">{children}</div>
    </div>
  );
}


