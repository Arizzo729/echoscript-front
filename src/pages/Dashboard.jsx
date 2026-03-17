// src/pages/Dashboard.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import * as api from "../lib/api";
import {
  Mic,
  FileText,
  Sparkles,
  Video,
  Clock,
  User,
  Settings2,
  ShieldCheck,
} from "lucide-react";

import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { t, i18n } = useTranslation();
  const [userData, setUserData] = useState({
    name: t("Echo User"),
    email: "user@echoscript.ai",
    plan: t("Free Plan"),
    minutesUsed: 0,
    sessions: 0,
    limit: 120,
    isGuest: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        
        const response = await fetch(api.SERVER_URL + "/api/v1/profile/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(prev => ({
            ...prev,
            minutesUsed: Math.round(data.minutesUsed || 0),
            sessions: data.sessions || 0,
            limit: data.limit || 120,
            plan: t(data.plan || "Free Plan"),
          }));
        }
      } catch (err) {
        console.error("Failed to fetch usage:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchUsage();
      const rawName = authUser.name || authUser.username || (authUser.email ? authUser.email.split('@')[0] : "Echo User");
      const nameVal = rawName === "Echo User" ? t("Echo User") : rawName;
      
      setUserData(prev => ({
        ...prev,
        name: nameVal,
        email: authUser.email || "user@echoscript.ai",
        isGuest: (authUser.plan || "").toLowerCase().includes("guest"),
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        name: t("Echo User"),
        plan: t("Free Plan")
      }));
      setLoading(false);
    }
  }, [authUser, i18n.language, t]);

  const sections = useMemo(() => [
    {
      icon: <Mic />,
      label: "dashboard.upload_audio",
      desc: "dashboard.upload_audio_desc",
      route: "/upload",
      color: "from-teal-500 to-teal-700",
    },
    {
      icon: <FileText />,
      label: "dashboard.transcripts",
      desc: "dashboard.transcripts_desc",
      route: "/transcripts",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      icon: <Sparkles />,
      label: "dashboard.summarize",
      desc: "dashboard.summarize_desc",
      route: "/summary",
      color: "from-purple-500 to-purple-700",
    },
    {
      icon: <Video />,
      label: "dashboard.video_upload",
      desc: "dashboard.video_upload_desc",
      route: "/video",
      color: "from-rose-500 to-rose-700",
    },
    {
      icon: <Clock />,
      label: "dashboard.history",
      desc: "dashboard.history_desc",
      route: "/history",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      icon: <Settings2 />,
      label: "dashboard.settings",
      desc: "dashboard.settings_desc",
      route: "/settings",
      color: "from-zinc-600 to-zinc-800",
    },
  ], []);

  const percentUsed = Math.min((userData.minutesUsed / userData.limit) * 100, 100);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-2 md:px-6 py-10 min-h-[90vh] animate-fade-in"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow">
            {t("dashboard.welcome_back", "Welcome back")}, <span className="text-teal-400" key={i18n.language}>{userData.name}</span>
          </h1>
          <p className="text-base text-zinc-400 mt-2">
            {t("dashboard.hero_text", "Here’s your command center for EchoScript.AI. Ready to transcribe, summarize, and manage content with AI!")}
          </p>
        </div>
        <button
          onClick={() => navigate("/account")}
          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold shadow hover:from-teal-500 hover:to-cyan-400 focus-visible:ring-2 focus-visible:ring-teal-400 transition"
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:inline">{userData.email}</span>
          <span className="sm:hidden">{t("Account")}</span>
        </button>
      </motion.header>

      {/* Action Grid */}
      <motion.div
        className="mb-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
          hidden: {},
        }}
      >
        {sections.map(({ icon, label, route, desc, color }) => (
          <DashboardActionCard
            key={label}
            icon={icon}
            label={label}
            desc={desc}
            color={color}
            onClick={() => navigate(route)}
          />
        ))}
      </motion.div>

      {/* Usage, Profile, & Plan */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Usage */}
        <motion.div
          className="rounded-2xl border border-zinc-700 bg-zinc-900 shadow-lg p-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              {t("Usage Summary")}
            </h2>
            {loading ? (
              <p className="text-sm text-zinc-500">{t("Loading usage...")}</p>
            ) : (
              <>
                <ul className="space-y-2 text-sm text-zinc-300" key={i18n.language}>
                  <li>
                    <strong className="text-white">{t("Plan")}:</strong> {userData.plan}
                  </li>
                  <li>
                    <strong className="text-white">{t("Minutes Used")}:</strong> {userData.minutesUsed} / {userData.limit}
                  </li>
                  <li>
                    <strong className="text-white">{t("Sessions")}:</strong> {userData.sessions}
                  </li>
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
                  {percentUsed.toFixed(1)}% {t("used")}
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => navigate("/purchase/minutes")}
            className="mt-6 w-full py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold shadow hover:from-amber-500 hover:to-orange-400 focus-visible:ring-2 focus-visible:ring-amber-400 transition"
          >
            {t("Buy More Minutes")}
          </button>
        </motion.div>

        {/* Profile */}
        <motion.div
          className="rounded-2xl border border-zinc-700 bg-zinc-900 shadow-lg p-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-4 mb-3" key={i18n.language}>
            <Avatar user={authUser} size="medium" />
            <div>
              <p className="text-lg font-semibold text-white">
                {userData.name} {userData.isGuest ? `(${t("Guest User")})` : ""}
              </p>
              <p className="text-sm text-zinc-400">{userData.email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/account")}
            className="w-full mt-2 py-2 rounded-lg bg-gradient-to-r from-zinc-700 to-zinc-800 text-white font-medium shadow hover:from-zinc-800 hover:to-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 transition"
          >
            {t("Account Settings")}
          </button>
        </motion.div>

        {/* Plan Card */}
        <motion.div
          className="rounded-2xl border border-teal-700 bg-gradient-to-br from-teal-900 to-blue-900 shadow-xl p-6 flex flex-col items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-3" key={i18n.language}>
            <ShieldCheck className="w-7 h-7 text-teal-300" />
            <span className="text-xl font-bold text-teal-200">{userData.plan}</span>
          </div>
          <div>
            <p className="text-zinc-200 mb-2" key={i18n.language}>
              {(userData.plan.toLowerCase().includes("free") || userData.plan.toLowerCase().includes("guest") || userData.plan.includes("免费") || userData.plan.includes("访客"))
                ? t("Unlock advanced features, faster transcription, and premium support.")
                : t("You are currently on the {{plan}}. Enjoy your premium features!", { plan: userData.plan })}
            </p>
          </div>
          {(userData.plan.toLowerCase().includes("free") || userData.plan.toLowerCase().includes("guest")) && (
            <button
              onClick={() => navigate("/purchase")}
              className="mt-2 w-full py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold shadow hover:from-teal-400 hover:to-blue-400 focus-visible:ring-2 focus-visible:ring-teal-400 transition"
            >
              {t("Upgrade Plan")}
            </button>
          )}
        </motion.div>
      </div>

      {/* Pro tip card */}
      <motion.div
        className="mt-6 p-5 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-start gap-3 shadow"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Sparkles className="w-6 h-6 text-teal-300 mt-0.5" />
        <div>
          <p className="text-sm text-teal-300 font-semibold">{t("Pro Tip")}</p>
          <p className="text-sm text-zinc-400">
            {t("Upload clear audio for the best transcription quality. Try upgrading your plan to unlock even more features and faster processing!")}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Card for dashboard actions
function DashboardActionCard({ icon, label, desc, color, onClick }) {
  const { t, i18n } = useTranslation();
  return (
    <motion.button
      whileHover={{ scale: 1.045 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex flex-col justify-between items-start w-full h-40 md:h-44 p-5 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white transition-all group border-2 border-transparent hover:border-teal-300/60`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4 mb-2">
        <span className="p-3 bg-white/20 rounded-full shadow">
          {React.cloneElement(icon, { className: "w-6 h-6" })}
        </span>
        <span className="text-lg font-bold" key={i18n.language}>{t(label)}</span>
      </div>
      <p className="text-zinc-200 text-[15px] mb-2 flex-1 text-left" key={i18n.language}>{t(desc)}</p>
      <span className="text-xs text-white/80 mt-auto group-hover:translate-x-1 transition-transform">{t("Go")} &rarr;</span>
    </motion.button>
  );
}
