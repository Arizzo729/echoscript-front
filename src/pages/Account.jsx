// components/Account.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, BadgeCheck } from "lucide-react";
import Button from "../components/ui/Button";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const ownerEmail = "andrew@echoscript.ai";
const availablePlans = ["Guest", "Pro", "Enterprise"];

export default function Account() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const isGuest = !user || !user.email;

  const [fakePlan, setFakePlan] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("fakePlan") || ""
      : ""
  );

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (fakePlan) localStorage.setItem("fakePlan", fakePlan);
    else localStorage.removeItem("fakePlan");
  }, [fakePlan]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const displayUser = {
    name: isGuest ? "Guest User" : user?.name || "User",
    email: isGuest ? "guest@echoscript.ai" : user?.email,
    plan: isGuest ? "Guest" : user?.plan || "Free",
    avatar: user?.avatar || "/default-avatar.png",
    isGuest,
  };

  const displayedPlan = fakePlan || displayUser.plan;

  return (
    <motion.div
      className="min-h-screen bg-zinc-950/95 dark:bg-zinc-900/95 px-4 sm:px-6 py-8 sm:py-12 flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent">
          👤 {displayUser.name}
        </h1>

        <Button
          onClick={toggleDarkMode}
          size="sm"
          variant="ghost"
          className="flex items-center gap-2"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="hidden sm:inline">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </Button>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        {/* PROFILE */}
        <AccountCard title="Profile Overview">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <img
              src={displayUser.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full border border-zinc-600"
            />
            <div className="text-center sm:text-left">
              <p className="text-xl font-semibold text-white">
                {displayUser.name}
              </p>
              <p className="text-zinc-400">{displayUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-300">
            <strong className="text-sm">Plan:</strong>
            <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-700 to-teal-700 text-white">
              <BadgeCheck className="w-3 h-3 mr-1" />
              {displayedPlan}
            </span>
          </div>

          {/* OWNER MODE */}
          {displayUser.email === ownerEmail && (
            <div className="mt-4">
              <select
                value={fakePlan}
                onChange={(e) => setFakePlan(e.target.value)}
                className="bg-zinc-800 text-white px-3 py-2 rounded"
              >
                <option value="">Your Plan</option>
                {availablePlans.map((p) => (
                  <option key={p} value={p}>
                    View as {p}
                  </option>
                ))}
              </select>
            </div>
          )}
        </AccountCard>

        {/* GUEST CARD */}
        {displayUser.isGuest && (
          <AccountCard title="Guest Mode">
            <p>You are currently using a guest account.</p>
            <p className="text-zinc-400">
              Create an account to save transcripts and unlock full features.
            </p>

            <Button
              onClick={() => (window.location.href = "/signup")}
              className="mt-3 bg-teal-600 hover:bg-teal-700"
            >
              Create Account
            </Button>
          </AccountCard>
        )}

        {/* INFO */}
        {!displayUser.isGuest && (
          <AccountCard title="Account Benefits">
            <p>Track usage, save transcripts, and manage your plan.</p>
          </AccountCard>
        )}
      </main>
    </motion.div>
  );
}

function AccountCard({ title, children }) {
  return (
    <motion.section className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow space-y-2">
      <h2 className="text-lg font-semibold text-teal-400">{title}</h2>
      <div className="text-zinc-300">{children}</div>
    </motion.section>
  );
}
