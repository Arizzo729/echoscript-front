// components/Account.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, LogOut, Moon, Sun, BadgeCheck, FileText, Camera } from "lucide-react";
import Button from "../components/ui/Button";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import Avatar from "../components/Avatar";
import * as api from "../lib/api";

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
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0); // used for cache-busting
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

  const { user: authUser, fetchUser } = useAuth();

  // Sync local user state with auth context
  useEffect(() => {
    if (authUser) {
      console.log("Account syncing with authUser:", authUser);
      setUser(prev => ({
        ...prev,
        name: authUser.name || authUser.username || (authUser.email ? authUser.email.split('@')[0] : "User"),
        email: authUser.email || "",
        plan: authUser.plan || "Guest",
        minutesUsed: authUser.minutesUsed || 0,
        sessions: authUser.sessions || 0,
        avatar: authUser.avatar || "/default-avatar.png",
        isGuest: (authUser.plan || "").toLowerCase().includes("guest"),
      }));
    }
  }, [authUser]);

  useEffect(() => {
    if (fakePlan) localStorage.setItem("fakePlan", fakePlan);
    else localStorage.removeItem("fakePlan");
  }, [fakePlan]);

  const { theme, toggleTheme } = useTheme();

  const toggleDarkMode = () => {
    toggleTheme();
  };

  useEffect(() => {
    setUser((prev) => ({ ...prev, darkMode: theme === "dark" }));
  }, [theme]);

  const displayedPlan = fakePlan || user.plan;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4 sm:px-6 py-8 sm:py-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-teal-400 tracking-tight">
              {t("account.title")}
            </h1>
            <p className="text-zinc-400 mt-2">{t("account.managePreferences")}</p>
          </div>
          <Button
            onClick={toggleDarkMode}
            size="sm"
            variant="ghost"
            aria-label={user.darkMode ? t("account.lightMode") : t("account.darkMode")}
            className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-600 transition-colors"
          >
            {user.darkMode
              ? <Sun className="w-5 h-5" />
              : <Moon className="w-5 h-5" />
            }
            <span className="hidden sm:inline">{user.darkMode ? t("account.lightMode") : t("account.darkMode")}</span>
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <AccountCard title={t("account.profileInformation")}>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* avatar wrapper has fixed size to avoid collapse when no image or during auth load */}
                <div className="relative inline-block w-32 h-32">
                  {/* merge authUser and local user and append cache-busting query param to avatar */}
                <Avatar
                  user={{
                    ...(authUser || {}),
                    avatar: user.avatar ? `${user.avatar}${avatarVersion ? `?v=${avatarVersion}` : ''}` : user.avatar,
                  }}
                  size="xl"
                />
                  <label className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 bg-teal-600 rounded-full cursor-pointer border-2 border-zinc-900 hover:bg-teal-500 transition-colors shadow-lg" title={t("account.changeAvatar")}>
                    <Camera className={`w-5 h-5 text-white ${uploadLoading ? 'animate-spin' : ''}`} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      disabled={uploadLoading}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        // Validate file type
                        if (!file.type.startsWith('image/')) {
                          setUploadError(t("account.invalidImageFile"));
                          setTimeout(() => setUploadError(""), 3000);
                          return;
                        }
                        
                        const token = localStorage.getItem('access_token');
                        if (!token) {
                          setUploadError(t("account.notLoggedIn"));
                          setTimeout(() => setUploadError(""), 3000);
                          return;
                        }

                        // Client-side size check (2MB)
                        if (file.size > 2 * 1024 * 1024) {
                          setUploadError(t("account.imageSizeExceeded"));
                          setTimeout(() => setUploadError(""), 3000);
                          return;
                        }

                        setUploadLoading(true);
                        setUploadError("");
                        setUploadSuccess(false);
                        
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        try {
                          const res = await fetch(api.SERVER_URL + "/api/v1/user/avatar", {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${token}`
                            },
                            body: formData
                          });
                          
                          if (res.ok) {
                            const data = await res.json();
                            console.log('Avatar upload success:', data);
                            
                            // Update user avatar in state
                            if (data.avatar_url) {
                              setUser(prev => ({
                                ...prev,
                                avatar: data.avatar_url
                              }));
                              // bump version to bust browser cache
                              setAvatarVersion(Date.now());
                              // also refresh the global auth context so header/avatar updates
                              if (typeof fetchUser === 'function') {
                                fetchUser().catch(e => console.error('refresh after avatar failed', e));
                              }
                              setUploadSuccess(true);
                              setTimeout(() => setUploadSuccess(false), 3000);
                            }
                            
                            setUploadLoading(false);
                          } else {
                            let errorMsg = t("account.uploadFailed");
                            try {
                              const errorData = await res.json();
                              errorMsg = errorData.detail || errorMsg;
                            } catch (e) {
                              console.error('Failed to parse error response:', e);
                            }
                            setUploadError(errorMsg);
                            setUploadLoading(false);
                            setTimeout(() => setUploadError(""), 5000);
                          }
                        } catch (err) {
                          console.error("Upload failed", err);
                          setUploadError(t("account.uploadFailedConnection"));
                          setUploadLoading(false);
                          setTimeout(() => setUploadError(""), 5000);
                        }
                      }}
                    />
                  </label>
                  {uploadError && (
                    <div className="absolute -bottom-12 left-0 right-0 text-xs text-red-400 text-center bg-red-900/20 rounded px-2 py-1">
                      {uploadError}
                    </div>
                  )}
                  {uploadSuccess && (
                    <div className="absolute -bottom-12 left-0 right-0 text-xs text-green-400 text-center bg-green-900/20 rounded px-2 py-1">
                      {t("account.avatarUpdateSuccess")}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t("account.fullName")}</label>
                    <p className="text-xl font-semibold text-white">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t("account.emailAddress")}</label>
                    <p className="text-lg text-zinc-200">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t("account.planLabel")}</label>
                    <span className="inline-flex items-center text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-blue-700 to-teal-700 text-white shadow-sm">
                      <BadgeCheck className="w-4 h-4 mr-2" />
                      {displayedPlan}
                    </span>
                  </div>
                </div>
              </div>
            </AccountCard>
          </div>

          {/* Sidebar with additional info */}
          <div className="space-y-6">
            <AccountCard title={t("account.accountStatus")}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-300">{t("account.minutesUsed")}</span>
                  <span className="text-sm font-medium text-white">{user.minutesUsed} / {user.limit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-300">{t("account.sessions")}</span>
                  <span className="text-sm font-medium text-white">{user.sessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-300">{t("account.accountType")}</span>
                  <span className="text-sm font-medium text-white">{user.isGuest ? t("account.guest") : t("account.registered")}</span>
                </div>
              </div>
            </AccountCard>

            {user.email === ownerEmail && (
              <AccountCard title={t("account.ownerModeLabel")}>
                <div className="space-y-3">
                  <label htmlFor="planSelect" className="block text-sm font-medium text-white">
                    👑 {t("account.testPlans")}
                  </label>
                  <select
                    id="planSelect"
                    value={fakePlan}
                    onChange={(e) => setFakePlan(e.target.value)}
                    className="w-full bg-zinc-800 text-white px-3 py-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                  >
                    <option value="">{t("account.realPlanOption") || "Your Real Plan"}</option>
                    {availablePlans.map((plan) => (
                      <option key={plan} value={plan}>
                        {t("account.viewAs", { plan }) || `View as ${plan}`}
                      </option>
                    ))}
                  </select>
                </div>
              </AccountCard>
            )}
          </div>
        </div>
      </div>
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

