// components/Account.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  LogOut,
  Moon,
  Sun,
  BadgeCheck,
  FileText,
  Crown,
  UserPlus,
  Settings,
} from "lucide-react";
import Button from "../components/ui/Button"; // keep your existing button
import { useTranslation } from "react-i18next";

/**
 * PRO Account page
 * - Detects auth state via /api/auth/me
 * - Clear guest vs. user UI
 * - Upgrade/Manage subscription actions (Stripe)
 * - Accessible, responsive, dark-mode friendly
 */

const ownerEmail = "andrew@echoscript.ai";
const availablePlans = ["Guest", "Pro", "Enterprise"];

export default function Account() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fakePlan, setFakePlan] = useState(
    () =>
      (typeof window !== "undefined" && localStorage.getItem("fakePlan")) || ""
  );

  const [user, setUser] = useState(() => ({
    name: t("account.guestName") || "Guest",
    email: "guest@echoscript.ai",
    plan: "Guest",
    minutesUsed: 0,
    sessions: 0,
    darkMode: typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
    avatar: "/default-avatar.png",
    isGuest: true,
  }));

  // ------------------------------------------------------------
  // Persist "view as" (owner-only)
  // ------------------------------------------------------------
  useEffect(() => {
    if (fakePlan) localStorage.setItem("fakePlan", fakePlan);
    else localStorage.removeItem("fakePlan");
  }, [fakePlan]);

  // ------------------------------------------------------------
  // Load current user (guest if 401)
  // ------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function fetchMe() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.status === 401) {
          if (!cancelled) {
            setUser((prev) => ({
              ...prev,
              name: t("account.guestName") || "Guest",
              email: "guest@echoscript.ai",
              plan: "Guest",
              isGuest: true,
            }));
          }
        } else if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!cancelled) {
            setUser((prev) => ({
              ...prev,
              name: data.name || data.full_name || data.username || prev.name,
              email: data.email || prev.email,
              plan: (data.plan || data.tier || "Guest") || "Guest",
              minutesUsed: data.minutes_used ?? prev.minutesUsed,
              sessions: data.sessions ?? prev.sessions,
              isGuest: false,
            }));
          }
        } else {
          if (!cancelled) setError(`Auth error: ${res.status}`);
        }
      } catch (e) {
        if (!cancelled) setError("Network error while loading account.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMe();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------
  // Dark mode toggle
  // ------------------------------------------------------------
  const toggleDarkMode = () => {
    const next = !user.darkMode;
    setUser((prev) => ({ ...prev, darkMode: next }));
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  // Which plan should we show (owner can "view as")
  const displayedPlan = useMemo(
    () => fakePlan || user.plan || "Guest",
    [fakePlan, user.plan]
  );
  const isSubscribed = displayedPlan && displayedPlan !== "Guest";

  // ------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------
  const [busy, setBusy] = useState({ upgrade: false, manage: false, export: false, logout: false });

  async function handleUpgrade(plan = "pro") {
    setBusy((b) => ({ ...b, upgrade: true }));
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (_) {}
      if (!res.ok) {
        alert(
          (data && (data.detail || data.error)) ||
            `Upgrade failed (${res.status}).`
        );
        return;
      }
      if (data.url) window.location.assign(data.url);
      else alert("No checkout URL returned. Please try again.");
    } catch (e) {
      alert("Network error while creating checkout session.");
    } finally {
      setBusy((b) => ({ ...b, upgrade: false }));
    }
  }

  async function handleManage() {
    setBusy((b) => ({ ...b, manage: true }));
    try {
      // Primary endpoint (adjust to your backend if different)
      let res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        // Fallback to an alternate naming some backends use
        res = await fetch("/api/stripe/create-customer-portal-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
      }
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (_) {}
      if (!res.ok) {
        alert(
          (data && (data.detail || data.error)) ||
            `Could not open customer portal (${res.status}).`
        );
        return;
      }
      if (data.url) window.open(data.url, "_blank", "noopener,noreferrer");
      else alert("No portal URL returned.");
    } catch (e) {
      alert("Network error while opening customer portal.");
    } finally {
      setBusy((b) => ({ ...b, manage: false }));
    }
  }

  async function handleExport() {
    setBusy((b) => ({ ...b, export: true }));
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        credentials: "include",
      });
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (_) {}
      if (!res.ok) {
        alert(
          (data && (data.detail || data.error)) ||
            `Export failed (${res.status}).`
        );
        return;
      }
      if (data.url) window.open(data.url, "_blank", "noopener,noreferrer");
      else alert("Export ready, but no URL returned.");
    } catch (e) {
      alert("Network error while preparing export.");
    } finally {
      setBusy((b) => ({ ...b, export: false }));
    }
  }

  async function handleLogout() {
    setBusy((b) => ({ ...b, logout: true }));
    try {
      // Try POST /api/auth/logout (adjust if your backend uses GET)
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) {
        // fallback GET (some stacks)
        await fetch("/api/auth/logout", { credentials: "include" });
      }
      window.location.reload();
    } catch (e) {
      alert("Logout failed. Please try again.");
    } finally {
      setBusy((b) => ({ ...b, logout: false }));
    }
  }

  function handleSignIn() {
    // Route to your login page; adjust if different
    window.location.assign("/login");
  }

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <motion.div
      className="min-h-screen bg-zinc-950/95 dark:bg-zinc-900/95 px-4 sm:px-6 py-8 sm:py-12 flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          👤 {user.isGuest ? (t("account.guestName") || "Guest") : user.name}
        </h1>

        <div className="flex items-center gap-2">
          <Button
            onClick={toggleDarkMode}
            size="sm"
            variant="ghost"
            aria-label={user.darkMode ? (t("account.lightMode") || "Light mode") : (t("account.darkMode") || "Dark mode")}
            className="flex items-center gap-2 border-none"
          >
            {user.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="hidden sm:inline">
              {user.darkMode ? (t("account.lightMode") || "Light mode") : (t("account.darkMode") || "Dark mode")}
            </span>
          </Button>

          {!user.isGuest ? (
            <Button
              onClick={handleLogout}
              size="sm"
              variant="outline"
              loading={busy.logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t("account.logout") || "Sign out"}
            </Button>
          ) : (
            <Button
              onClick={handleSignIn}
              size="sm"
              variant="solid"
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {t("account.signin") || "Sign in / Create account"}
            </Button>
          )}
        </div>
      </header>

      {loading && (
        <div className="text-zinc-300">{t("common.loading") || "Loading account…"}</div>
      )}
      {error && (
        <div className="text-red-400">{error}</div>
      )}

      {!loading && (
        <main className="flex-1 flex flex-col gap-6">
          {/* Profile Overview */}
          <AccountCard title={t("account.profileOverviewTitle") || "Profile overview"}>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <img
                src={user.avatar}
                alt={t("account.avatarAltText") || "User avatar"}
                className="w-20 h-20 rounded-full border-2 border-zinc-400 dark:border-zinc-600 object-cover shadow-md"
                draggable={false}
              />
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <p className="text-xl font-semibold text-white">
                  {user.isGuest ? (t("account.guestName") || "Guest") : user.name}
                </p>
                <p className="text-base text-zinc-400">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-zinc-300">
              <strong className="text-sm">{t("account.planLabel") || "Plan"}:</strong>
              <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-blue-700 to-teal-700 text-white shadow-sm">
                <BadgeCheck className="w-3 h-3 mr-1" />
                {displayedPlan}
              </span>

              {!user.isGuest && user.email === ownerEmail && (
                <span className="inline-flex items-center gap-1 text-amber-400 ml-2 text-xs">
                  <Crown className="w-4 h-4" />
                  {t("account.owner") || "Owner"}
                </span>
              )}
            </div>

            {/* Owner-only “View as” */}
            {!user.isGuest && user.email === ownerEmail && (
              <div className="mt-5 flex flex-col gap-1 w-full max-w-xs">
                <label htmlFor="planSelect" className="block text-sm font-medium text-white mb-1">
                  👑 {t("account.ownerModeLabel") || "Owner Mode"}
                </label>
                <select
                  id="planSelect"
                  value={fakePlan}
                  onChange={(e) => setFakePlan(e.target.value)}
                  className="bg-zinc-800 text-white px-3 py-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                >
                  <option value="">{t("account.realPlanOption") || "(Your Real Plan)"}</option>
                  {availablePlans.map((plan) => (
                    <option key={plan} value={plan}>
                      {t("account.viewAs", { plan }) || `View as ${plan}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </AccountCard>

          {/* Subscription actions */}
          <AccountCard title={t("account.subscription") || "Subscription"}>
            {user.isGuest ? (
              <p className="text-zinc-300 mb-3">
                {t("account.guestCta") ||
                  "Create a free account to save transcripts, track usage, and upgrade when you’re ready."}
              </p>
            ) : (
              <p className="text-zinc-300 mb-3">
                {isSubscribed
                  ? (t("account.activePlan") || "Your subscription is active.")
                  : (t("account.freePlan") || "You’re on the free plan. Upgrade to unlock more features.")}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {!isSubscribed && (
                <Button
                  onClick={() => handleUpgrade("pro")}
                  loading={busy.upgrade}
                  className="flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  {t("account.upgradePro") || "Upgrade to Pro"}
                </Button>
              )}

              {!user.isGuest && (
                <Button
                  onClick={handleManage}
                  variant="outline"
                  loading={busy.manage}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {t("account.manage") || "Manage subscription"}
                </Button>
              )}
            </div>
          </AccountCard>

          {/* Usage */}
          <AccountCard title={t("account.usageTitle") || "Usage"}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-zinc-300">
              <Metric label={t("account.minutesUsed") || "Minutes used"} value={user.minutesUsed} />
              <Metric label={t("account.sessions") || "Sessions"} value={user.sessions} />
              <Metric label={t("account.currentPlan") || "Current plan"} value={displayedPlan} />
            </div>
          </AccountCard>

          {/* Info / policies */}
          <AccountCard title={t("account.helpTitle") || "Help & Policies"}>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li>
                <a className="underline hover:no-underline" href="/privacy">
                  <FileText className="inline w-4 h-4 mr-1" />
                  {t("common.privacy") || "Privacy Policy"}
                </a>
              </li>
              <li>
                <a className="underline hover:no-underline" href="/terms">
                  <FileText className="inline w-4 h-4 mr-1" />
                  {t("common.terms") || "Terms of Service"}
                </a>
              </li>
            </ul>
          </AccountCard>

          {/* Data export */}
          {!user.isGuest && (
            <AccountCard title={t("account.dataTitle") || "Your data"}>
              <p className="text-zinc-300 mb-3">
                {t("account.dataText") ||
                  "Export your data anytime. We’ll prepare a downloadable archive (JSON/CSV where applicable)."}
              </p>
              <Button
                onClick={handleExport}
                variant="outline"
                loading={busy.export}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t("account.downloadData") || "Download my data"}
              </Button>
            </AccountCard>
          )}
        </main>
      )}
    </motion.div>
  );
}

/** Section card */
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

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-xl font-semibold text-white">{String(value ?? "—")}</div>
    </div>
  );
}
