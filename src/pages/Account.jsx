// src/pages/Account.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download, LogOut, Moon, Sun, BadgeCheck, FileText, Crown, UserPlus, Settings, Save, Undo2,
} from "lucide-react";
import Button from "../components/ui/Button";
import { useTranslation } from "react-i18next";

/**
 * Account page with:
 * - Solid logout (POST /api/auth/logout + clear local state)
 * - Professional layout
 * - Editable display name (saved locally per email; no backend schema changes needed)
 * - Stripe upgrade/manage with credentials included
 */

const ownerEmail = "andrew@echoscript.ai";
const availablePlans = ["Guest", "Pro", "Enterprise"];

// localStorage helpers for per-email display name
const nameKey = (email) => `displayName:${(email || "").toLowerCase()}`;
const getStoredName = (email) => {
  try { return localStorage.getItem(nameKey(email)) || ""; } catch { return ""; }
};
const setStoredName = (email, value) => {
  try {
    const key = nameKey(email);
    if (!value) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
};

export default function Account() {
  const { t } = useTranslation();
  const tf = (k, f) => t(k, { defaultValue: f });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fakePlan, setFakePlan] = useState(
    () => (typeof window !== "undefined" && localStorage.getItem("fakePlan")) || ""
  );

  const [user, setUser] = useState(() => ({
    name: tf("account.guestName", "Guest"),
    email: "guest@echoscript.ai",
    plan: "Guest",
    minutesUsed: 0,
    sessions: 0,
    darkMode:
      typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : false,
    avatar: "/default-avatar.png",
    isGuest: true,
  }));

  // UI state for editable display name
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Persist “view as” (owner only)
  useEffect(() => {
    if (fakePlan) localStorage.setItem("fakePlan", fakePlan);
    else localStorage.removeItem("fakePlan");
  }, [fakePlan]);

  // Fetch current user ONCE
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.status === 401) {
          if (!cancelled) {
            setUser((prev) => ({
              ...prev,
              name: tf("account.guestName", "Guest"),
              email: "guest@echoscript.ai",
              plan: "Guest",
              isGuest: true,
            }));
            setNameDraft("");
          }
        } else if (res.ok) {
          const data = await res.json().catch(() => ({}));
          const email = data?.email || "user@echoscript.ai";
          const derivedName =
            getStoredName(email) ||
            data?.name ||
            data?.full_name ||
            data?.username ||
            (typeof email === "string" ? email.split("@")[0] : "User");

          if (!cancelled) {
            setUser((prev) => ({
              ...prev,
              name: derivedName,
              email,
              plan: data?.plan || data?.tier || "Guest",
              minutesUsed: data?.minutes_used ?? prev.minutesUsed,
              sessions: data?.sessions ?? prev.sessions,
              isGuest: false,
            }));
            setNameDraft(derivedName);
          }
        } else {
          if (!cancelled) setError(`Auth error: ${res.status}`);
        }
      } catch {
        if (!cancelled) setError("Network error while loading account.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const toggleDarkMode = () => {
    const next = !user.darkMode;
    setUser((p) => ({ ...p, darkMode: next }));
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const displayedPlan = useMemo(() => fakePlan || user.plan || "Guest", [fakePlan, user.plan]);
  const isSubscribed = displayedPlan && displayedPlan !== "Guest";

  const [busy, setBusy] = useState({ upgrade: false, manage: false, export: false, logout: false });

  async function handleUpgrade(plan = "pro") {
    setBusy((b) => ({ ...b, upgrade: true }));
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan }),
      });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch {}
      if (!res.ok) return alert(data.detail || data.error || `Upgrade failed (${res.status}).`);
      if (data.url) window.location.assign(data.url);
      else alert("No checkout URL returned.");
    } catch {
      alert("Network error while creating checkout session.");
    } finally {
      setBusy((b) => ({ ...b, upgrade: false }));
    }
  }

  async function handleManage() {
    setBusy((b) => ({ ...b, manage: true }));
    try {
      let res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        res = await fetch("/api/stripe/create-customer-portal-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
      }
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch {}
      if (!res.ok) return alert(data.detail || data.error || `Portal error (${res.status}).`);
      if (data.url) window.open(data.url, "_blank", "noopener,noreferrer");
      else alert("No portal URL returned.");
    } catch {
      alert("Network error while opening customer portal.");
    } finally {
      setBusy((b) => ({ ...b, manage: false }));
    }
  }

  async function handleExport() {
    setBusy((b) => ({ ...b, export: true }));
    try {
      const res = await fetch("/api/export", { method: "POST", credentials: "include" });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch {}
      if (!res.ok) return alert(data.detail || data.error || `Export failed (${res.status}).`);
      if (data.url) window.open(data.url, "_blank", "noopener,noreferrer");
      else alert("Export ready but no URL returned.");
    } catch {
      alert("Network error while preparing export.");
    } finally {
      setBusy((b) => ({ ...b, export: false }));
    }
  }

  // ✅ reliable sign-out: server + local cleanup + redirect
  async function handleLogout() {
    setBusy((b) => ({ ...b, logout: true }));
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    try {
      if (user?.email) setStoredName(user.email, ""); // remove saved alias
      localStorage.removeItem("fakePlan");
    } catch {}
    window.location.assign("/signin");
  }

  function handleSignIn() {
    window.location.assign("/signin");
  }

  // Save display name (client-side)
  async function saveName() {
    if (user.isGuest) return;
    setSavingName(true);
    try {
      const clean = (nameDraft || "").trim();
      const next = clean || (user.email ? user.email.split("@")[0] : "User");
      setStoredName(user.email, clean); // persist (or clear if empty)
      setUser((p) => ({ ...p, name: next }));
    } finally {
      setSavingName(false);
    }
  }

  function resetNameToEmail() {
    if (user.isGuest) return;
    const fallback = user.email ? user.email.split("@")[0] : "User";
    setNameDraft(fallback);
  }

  return (
    <motion.div
      className="min-h-screen bg-zinc-950/95 dark:bg-zinc-900/95 px-4 sm:px-6 py-8 sm:py-12 flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          👤 {user.isGuest ? tf("account.guestName", "Guest") : user.name}
        </h1>

        <div className="flex items-center gap-2">
          <Button
            onClick={toggleDarkMode}
            size="sm"
            variant="ghost"
            className="flex items-center gap-2 border-none"
            aria-label={user.darkMode ? tf("account.lightMode", "Light mode") : tf("account.darkMode", "Dark mode")}
          >
            {user.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="hidden sm:inline">
              {user.darkMode ? tf("account.lightMode", "Light mode") : tf("account.darkMode", "Dark mode")}
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
              {tf("account.logout", "Sign out")}
            </Button>
          ) : (
            <Button onClick={handleSignIn} size="sm" variant="solid" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              {tf("account.signin", "Sign in / Create account")}
            </Button>
          )}
        </div>
      </header>

      {loading && <div className="text-zinc-300">{tf("common.loading", "Loading account…")}</div>}
      {error && <div className="text-red-400">{error}</div>}

      {!loading && (
        <main className="flex-1 flex flex-col gap-6">
          {/* Profile */}
          <AccountCard title={tf("account.profileOverviewTitle", "Profile overview")}>
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <img
                src={user.avatar}
                alt={tf("account.avatarAltText", "User avatar")}
                className="w-20 h-20 rounded-full border-2 border-zinc-400 dark:border-zinc-600 object-cover shadow-md"
                draggable={false}
              />
              <div className="flex-1 space-y-1">
                <p className="text-xl font-semibold text-white">
                  {user.isGuest ? tf("account.guestName", "Guest") : user.name}
                </p>
                <p className="text-base text-zinc-400">{user.email}</p>

                {/* Editable display name (logged-in only) */}
                {!user.isGuest && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-center">
                    <input
                      type="text"
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      placeholder={tf("account.namePlaceholder", "Your display name")}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      maxLength={64}
                    />
                    <Button onClick={saveName} loading={savingName} className="flex items-center gap-2">
                      <Save className="w-4 h-4" /> {tf("account.saveName", "Save")}
                    </Button>
                    <Button onClick={resetNameToEmail} variant="outline" className="flex items-center gap-2">
                      <Undo2 className="w-4 h-4" /> {tf("account.useEmailName", "Use email name")}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-zinc-300">
              <strong className="text-sm">{tf("account.planLabel", "Plan")}:</strong>
              <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-blue-700 to-teal-700 text-white shadow-sm">
                <BadgeCheck className="w-3 h-3 mr-1" />
                {displayedPlan}
              </span>

              {!user.isGuest && user.email === ownerEmail && (
                <span className="inline-flex items-center gap-1 text-amber-400 ml-2 text-xs">
                  <Crown className="w-4 h-4" />
                  {tf("account.owner", "Owner")}
                </span>
              )}
            </div>

            {/* Owner-only “View as” */}
            {!user.isGuest && user.email === ownerEmail && (
              <div className="mt-5 flex flex-col gap-1 w-full max-w-xs">
                <label htmlFor="planSelect" className="block text-sm font-medium text-white mb-1">
                  👑 {tf("account.ownerModeLabel", "Owner Mode")}
                </label>
                <select
                  id="planSelect"
                  value={fakePlan}
                  onChange={(e) => setFakePlan(e.target.value)}
                  className="bg-zinc-800 text-white px-3 py-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                >
                  <option value="">{tf("account.realPlanOption", "(Your Real Plan)")}</option>
                  {availablePlans.map((plan) => (
                    <option key={plan} value={plan}>
                      {`${tf("account.viewAs", "View as")} ${plan}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </AccountCard>

          {/* Subscription */}
          <AccountCard title={tf("account.subscription", "Subscription")}>
            {user.isGuest ? (
              <p className="text-zinc-300 mb-3">
                {tf(
                  "account.guestCta",
                  "Create a free account to save transcripts, track usage, and upgrade when you’re ready."
                )}
              </p>
            ) : (
              <p className="text-zinc-300 mb-3">
                {isSubscribed
                  ? tf("account.activePlan", "Your subscription is active.")
                  : tf("account.freePlan", "You’re on the free plan. Upgrade to unlock more features.")}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {!isSubscribed && (
                <Button onClick={() => handleUpgrade("pro")} loading={busy.upgrade} className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  {tf("account.upgradePro", "Upgrade to Pro")}
                </Button>
              )}

              {!user.isGuest && (
                <Button onClick={handleManage} variant="outline" loading={busy.manage} className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  {tf("account.manage", "Manage subscription")}
                </Button>
              )}
            </div>
          </AccountCard>

          {/* Usage */}
          <AccountCard title={tf("account.usageTitle", "Usage")}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-zinc-300">
              <Metric label={tf("account.minutesUsed", "Minutes used")} value={user.minutesUsed} />
              <Metric label={tf("account.sessions", "Sessions")} value={user.sessions} />
              <Metric label={tf("account.currentPlan", "Current plan")} value={displayedPlan} />
            </div>
          </AccountCard>

          {/* Info / policies */}
          <AccountCard title={tf("account.helpTitle", "Help & Policies")}>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li>
                <a className="underline hover:no-underline" href="/privacy">
                  <FileText className="inline w-4 h-4 mr-1" /> {tf("common.privacy", "Privacy Policy")}
                </a>
              </li>
              <li>
                <a className="underline hover:no-underline" href="/terms">
                  <FileText className="inline w-4 h-4 mr-1" /> {tf("common.terms", "Terms of Service")}
                </a>
              </li>
            </ul>
          </AccountCard>

          {/* Data export */}
          {!user.isGuest && (
            <AccountCard title={tf("account.dataTitle", "Your data")}>
              <p className="text-zinc-300 mb-3">
                {tf("account.dataText", "Export your data anytime. We’ll prepare a downloadable archive.")}
              </p>
              <Button onClick={handleExport} variant="outline" loading={busy.export} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {tf("account.downloadData", "Download my data")}
              </Button>
            </AccountCard>
          )}
        </main>
      )}
    </motion.div>
  );
}

function AccountCard({ title, children }) {
  return (
    <motion.section
      className="bg-zinc-900/90 dark:bg-zinc-800/95 p-5 sm:p-7 rounded-2xl border border-zinc-800 shadow-xl space-y-2"
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

