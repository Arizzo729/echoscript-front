import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, LogOut, Moon, Sun, BadgeCheck, FileText } from "lucide-react";
import Button from "../components/ui/Button";
import { useTranslation } from "react-i18next";

const ownerEmail = "andrew@echoscript.ai";
const availablePlans = ["Guest", "Pro", "Enterprise"];

export default function Account() {
  const { t } = useTranslation();
  const [fakePlan, setFakePlan] = useState(() => localStorage.getItem("fakePlan") || "");
  const [user, setUser] = useState({
    name: t("account.guestName"),
    email: "guest@echoscript.ai",
    plan: t("account.guestPlan"),
    minutesUsed: 0,
    sessions: 0,
    darkMode: false,
    avatar: "/default-avatar.png",
    isGuest: true,
  });

  useEffect(() => {
    if (fakePlan) localStorage.setItem("fakePlan", fakePlan);
    else localStorage.removeItem("fakePlan");
  }, [fakePlan]);

  const toggleDarkMode = () => {
    const nextMode = !user.darkMode;
    setUser((prev) => ({ ...prev, darkMode: nextMode }));
    document.documentElement.classList.toggle("dark", nextMode);
  };

  const displayedPlan = fakePlan || user.plan;

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
          {user.darkMode ? t("account.lightMode") : t("account.darkMode")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card title={t("account.profileOverviewTitle")}>
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
            <strong>{t("account.planLabel")}:</strong>
            <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-zinc-700 text-white">
              <BadgeCheck className="w-3 h-3 mr-1" />
              {displayedPlan}
            </span>
          </p>

          {user.email === ownerEmail && (
            <div className="mt-4">
              <label className="block text-sm text-white font-medium mb-1">👑 Owner Mode</label>
              <select
                value={fakePlan}
                onChange={(e) => setFakePlan(e.target.value)}
                className="bg-zinc-700 text-white px-3 py-1 rounded-md border border-zinc-600"
              >
                <option value="">(Your Real Plan)</option>
                {availablePlans.map((plan) => (
                  <option key={plan} value={plan}>
                    View as {plan}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Card>

        <Card title={t("account.whyAccountMattersTitle")}>
          <p>{t("account.whyAccountMattersText1")}</p>
          <p>{t("account.whyAccountMattersText2")}</p>
        </Card>

        <Card title={t("account.guestModeTitle")}>
          <p>{t("account.guestModeText1")}</p>
          <p>{t("account.guestModeText2")}</p>
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

