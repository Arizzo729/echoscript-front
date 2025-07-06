// components/Account.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, LogOut, Moon, Sun, BadgeCheck, FileText } from "lucide-react";
import Button from "../components/ui/Button";
import { useTranslation } from "react-i18next";

// Owner's email
const ownerEmail = "andrew@echoscript.ai";
const availablePlans = ["Guest", "Pro", "Enterprise"];

/**
 * World-class responsive Account page.
 * Mobile-first, fully accessible, dark/light theme supported.
 */
export default function Account() {
  const { t } = useTranslation();
  const [fakePlan, setFakePlan] = useState(() => typeof window !== "undefined" ? localStorage.getItem("fakePlan") || "" : "");
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
    if (nextMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const displayedPlan = fakePlan || user.plan;

  return (
    <motion.div
      className="min-h-screen bg-zinc-950/95 dark:bg-zinc-900/95 px-4 sm:px-6 py-8 sm:py-12 flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          👤 {user.name}
        </h1>
        <Button
          onClick={toggleDarkMode}
          size="sm"
          variant="ghost"
          aria-label={user.darkMode ? t("account.lightMode") : t("account.darkMode")}
          className="flex items-center gap-2 border-none"
        >
          {user.darkMode
            ? <Sun className="w-5 h-5" />
            : <Moon className="w-5 h-5" />
          }
          <span className="hidden sm:inline">{user.darkMode ? t("account.lightMode") : t("account.darkMode")}</span>
        </Button>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        <AccountCard title={t("account.profileOverviewTitle")}>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <img
              src={user.avatar}
              alt={t("account.avatarAltText")}
              className="w-20 h-20 rounded-full border-2 border-zinc-400 dark:border-zinc-600 object-cover shadow-md"
              draggable={false}
            />
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <p className="text-xl font-semibold text-white">{user.name}</p>
              <p className="text-base text-zinc-400">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-zinc-300">
            <strong className="text-sm">{t("account.planLabel")}:</strong>
            <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-blue-700 to-teal-700 text-white shadow-sm">
              <BadgeCheck className="w-3 h-3 mr-1" />
              {displayedPlan}
            </span>
          </div>

          {user.email === ownerEmail && (
            <div className="mt-5 flex flex-col gap-1 w-full max-w-xs">
              <label
                htmlFor="planSelect"
                className="block text-sm font-medium text-white mb-1"
              >
                👑 {t("account.ownerModeLabel") || "Owner Mode"}
              </label>
              <select
                id="planSelect"
                value={fakePlan}
                onChange={(e) => setFakePlan(e.target.value)}
                className="bg-zinc-800 text-white px-3 py-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
              >
                <option value="">({t("account.realPlanOption") || "Your Real Plan"})</option>
                {availablePlans.map((plan) => (
                  <option key={plan} value={plan}>
                    {t("account.viewAs", { plan }) || `View as ${plan}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </AccountCard>

        <AccountCard title={t("account.whyAccountMattersTitle")}>
          <p className="mb-1">{t("account.whyAccountMattersText1")}</p>
          <p>{t("account.whyAccountMattersText2")}</p>
        </AccountCard>

        <AccountCard title={t("account.guestModeTitle")}>
          <p className="mb-1">{t("account.guestModeText1")}</p>
          <p>{t("account.guestModeText2")}</p>
        </AccountCard>
      </main>
    </motion.div>
  );
}

/**
 * Responsive Card for Account page sections.
 */
function AccountCard({ title, children }) {
  return (
    <motion.section
      className="bg-zinc-900/90 dark:bg-zinc-800/95 p-5 sm:p-7 rounded-2xl border border-zinc-800 shadow-xl space-y-2 transition-all"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.44, ease: "easeOut" }}
    >
      <h2 className="text-lg font-semibold mb-2 bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
        {title}
      </h2>
      <div className="text-base text-zinc-300 space-y-1">{children}</div>
    </motion.section>
  );
}

