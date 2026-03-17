// src/pages/Settings.jsx
import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@headlessui/react";
import {
  Volume2, Music2, Settings2, Info, Mail, Text, Speaker, Languages, Bot, Bell,
  Eye, Moon, User, Star, LogIn, ChevronRight, Clock4
} from "lucide-react";
import Button from "../components/ui/Button";
import { FontSizeContext } from "../context/useFontSize";
import { useTranslation } from "react-i18next";
import { useSound } from "../context/SoundContext";
import i18n from "i18next";
import { useAuth } from "../context/AuthContext";
import LanguageToggle from "../components/LanguageToggle";

const tabs = [
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "account", label: "Account", icon: User },
  { id: "faq", label: "FAQ", icon: Info },
  { id: "contact", label: "Contact", icon: Mail },
];

import { useTheme } from "../context/useTheme";

export default function Settings() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("preferences");
  const darkMode = theme === "dark";
  const [showHints, setShowHints] = useState(true);
  const [accessibleFonts, setAccessibleFonts] = useState(false);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [multiLang, setMultiLang] = useState(true);

  const { fontSize, setFontSize } = useContext(FontSizeContext);
  const {
    isMuted,
    toggleMute,
    ambientEnabled,
    toggleAmbient,
    volume,
    setVolume,
  } = useSound();

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "zh", label: "中文 (简体)" }
  ];

  const currentLang = languages.find(l => l.code === i18n.resolvedLanguage) || languages[0];

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
    localStorage.setItem("i18nextLng", selectedLang);
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--base-font-scale",
      fontSize.toString()
    );
  }, [fontSize]);

  // Mobile first: full width, vertical stacking, padding
  return (
    <motion.div
      className={`min-h-screen px-2 sm:px-6 py-6 sm:py-10 max-w-2xl mx-auto transition-colors duration-300 ${darkMode ? 'bg-zinc-950/95 dark:bg-zinc-900/95' : 'bg-zinc-50'}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white dark:bg-zinc-900/95 p-4 sm:p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight bg-gradient-to-br from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-500 bg-clip-text text-transparent">
          {t("Settings")}
        </h1>
        {/* Mobile-first tabs: scrollable */}
        <nav className="flex gap-2 overflow-x-auto no-scrollbar mb-6 snap-x">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 min-w-[120px] justify-center rounded-xl snap-center shadow
                ${activeTab === tab.id
                  ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg"
                  : "bg-zinc-100 dark:bg-zinc-800/90 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 transition"
                }
                font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
              `}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden xs:inline">{t(tab.label)}</span>
            </button>
          ))}
        </nav>

        <div>
          <AnimatePresence mode="wait">
            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <Section title={t("Appearance & Comfort")} icon={<Moon className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  <ToggleRow
                    label={t("Dark Mode")}
                    value={darkMode}
                    onChange={toggleTheme}
                    icon={<Moon />}
                    darkMode={darkMode}
                    data-i18n="Dark Mode"
                  />
                  <ToggleRow
                    label={t("Show Helpful Hints")}
                    value={showHints}
                    onChange={() => setShowHints(!showHints)}
                    icon={<Eye />}
                    darkMode={darkMode}
                    data-i18n="Show Helpful Hints"
                  />
                  <ToggleRow
                    label={t("Accessible Fonts")}
                    value={accessibleFonts}
                    onChange={() => setAccessibleFonts(!accessibleFonts)}
                    icon={<Text />}
                    darkMode={darkMode}
                    data-i18n="Accessible Fonts"
                  />
                </Section>

                <Section title={t("Sound Settings")} icon={<Speaker className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  <ToggleRow
                    label={t("Sound Effects")}
                    value={!isMuted}
                    onChange={toggleMute}
                    icon={<Volume2 />}
                    darkMode={darkMode}
                    data-i18n="Sound Effects"
                  />
                  <ToggleRow
                    label={t("Ambient Music")}
                    value={ambientEnabled}
                    onChange={toggleAmbient}
                    icon={<Music2 />}
                    darkMode={darkMode}
                    data-i18n="Ambient Music"
                  />
                  <SliderRow
                    label={t("Volume")}
                    value={volume}
                    onChange={(val) => setVolume(parseFloat(val))}
                    min={0}
                    max={1}
                    step={0.01}
                    display={`${Math.round(volume * 100)}%`}
                    darkMode={darkMode}
                    data-i18n="Volume"
                  />
                </Section>

                <Section title={t("Font Size")} icon={<Text className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  <SliderRow
                    label={t("Base Size")}
                    value={fontSize}
                    onChange={(val) => setFontSize(parseFloat(val))}
                    min={0.8}
                    max={1.4}
                    step={0.05}
                    display={`${fontSize.toFixed(2)}x`}
                    darkMode={darkMode}
                    data-i18n="Base Size"
                  />
                </Section>

                <Section title={t("Extras")} darkMode={darkMode}>
                  {isAuthenticated ? (
                    <ToggleRow
                      label={t("Skip Intro Video")}
                      value={localStorage.getItem("skipIntro") === "true"}
                      onChange={() => {
                        const current = localStorage.getItem("skipIntro") === "true";
                        localStorage.setItem("skipIntro", (!current).toString());
                      }}
                      icon={<Eye />}
                      darkMode={darkMode}
                    />
                  ) : (
                    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border opacity-60 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                      <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        <Eye className="text-teal-600 dark:text-teal-400 w-4 h-4" />
                        <span>{t("Skip Intro Video")}</span>
                      </div>
                      <span className="text-xs text-zinc-500 italic pr-2">
                        {t("Sign in to enable")}
                      </span>
                    </div>
                  )}

                  <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border mt-3 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`} data-i18n="Time Zone">
                    <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <Clock4 className="text-teal-600 dark:text-teal-400 w-4 h-4" />
                      <span>{t("Time Zone")}</span>
                    </div>
                    <select
                      value={localStorage.getItem("timezone") || "UTC"}
                      onChange={(e) =>
                        localStorage.setItem("timezone", e.target.value)
                      }
                      className={`px-3 py-2 rounded-md border focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-zinc-700 text-white border-zinc-600' : 'bg-white text-zinc-900 border-zinc-300'}`}
                      data-i18n="settings.timezone_select"
                    >
                      {["UTC", "EST", "CST", "MST", "PST", "GMT", "CET"].map((tz) => (
                        <option key={tz} value={tz} data-i18n={`settings.timezones.${tz}`}>{t(`settings.timezones.${tz}`, tz)}</option>
                      ))}
                    </select>
                  </div>

                  <ToggleRow
                    label={t("AI Assistant")}
                    value={aiAssistantEnabled}
                    onChange={() => setAiAssistantEnabled(!aiAssistantEnabled)}
                    icon={<Bot />}
                    darkMode={darkMode}
                    data-i18n="AI Assistant"
                  />
                  <ToggleRow
                    label={t("Push Notifications")}
                    value={notifications}
                    onChange={() => setNotifications(!notifications)}
                    icon={<Bell />}
                    darkMode={darkMode}
                    data-i18n="Push Notifications"
                  />
                  <ToggleRow
                    label={t("Enable Multiple Languages")}
                    value={multiLang}
                    onChange={() => setMultiLang(!multiLang)}
                    icon={<Languages />}
                    darkMode={darkMode}
                    data-i18n="Enable Multiple Languages"
                  />
                  <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border mt-3 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`} data-i18n="settings.language_field">
                    <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <Languages className="text-teal-600 dark:text-teal-400 w-4 h-4" />
                      <span data-i18n="settings.language_label">{t("language_label", "Language")}</span>
                    </div>
                    {/* LanguageToggle is imported above */}
                    <LanguageToggle />
                  </div>
                </Section>
              </motion.div>
            )}

            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35 }}
              >
                <Section title={t("Account Settings")} icon={<User className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  {isAuthenticated ? (
                    <div className="space-y-5">
                      <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>
                        <p>
                          <strong>{t("Email")}:</strong> {user?.email || "your@email.com"}
                        </p>
                        <p>
                          <strong>{t("Plan")}:</strong>{" "}
                          {localStorage.getItem("fakePlan") || user?.plan || "Pro"}
                        </p>
                        {user?.email === "andrew@echoscript.ai" && (
                          <div className="mt-4">
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                              👑 {t("Owner Mode")}
                            </label>
                            <select
                              value={localStorage.getItem("fakePlan") || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val) localStorage.setItem("fakePlan", val);
                                else localStorage.removeItem("fakePlan");
                              }}
                              className={`px-3 py-2 rounded-md border focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-zinc-700 text-white border-zinc-600' : 'bg-white text-zinc-900 border-zinc-300'}`}
                            >
                              <option value="">({t("Your Real Plan")})</option>
                              <option value="Guest">{t("View as Guest")}</option>
                              <option value="Pro">{t("View as Pro")}</option>
                              <option value="Enterprise">{t("View as Enterprise")}</option>
                            </select>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" icon={<Star />} fullWidth>
                        {t("Manage Subscription")}
                      </Button>
                      <Button variant="destructive" fullWidth>
                        {t("Delete Account")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className={darkMode ? "text-zinc-300" : "text-zinc-600"}>{t("You’re using EchoScript as a guest.")}</p>
                      <Button 
                        variant="primary" 
                        icon={<LogIn />} 
                        fullWidth 
                        onClick={() => window.location.href = '/signup'}
                        className="active:scale-95 transition-transform touch-manipulation py-4"
                      >
                        {t("Create Account")}
                      </Button>
                      <Button 
                        variant="outline" 
                        icon={<ChevronRight />} 
                        fullWidth
                        onClick={() => window.location.href = '/purchase'}
                        className="active:scale-95 transition-transform touch-manipulation"
                      >
                        {t("Learn About Plans")}
                      </Button>
                    </div>
                  )}
                </Section>
              </motion.div>
            )}

            {activeTab === "faq" && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35 }}
              >
                <Section title={t("Frequently Asked Questions")} icon={<Info className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  {[
                    t("Why won't my file upload?"),
                    t("What determines the enterprise estimate?"),
                    t("Can I buy more minutes?"),
                    t("How secure is my data?"),
                    t("What formats are supported?"),
                  ].map((q, i) => (
                    <div
                      key={i}
                      className={`p-4 border rounded-2xl mb-2 ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                    >
                      <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{q}</p>
                      <Button size="xs" variant="outline">
                        {t("More info")}
                      </Button>
                    </div>
                  ))}
                </Section>
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35 }}
              >
                <Section title={t("Contact Us")} icon={<Mail className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  <div className={`rounded-2xl p-5 border text-sm space-y-2 ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                    <p className={darkMode ? "text-zinc-300" : "text-zinc-600"}>
                      {t("Email")}: <span className="text-teal-600 dark:text-teal-400">support@echoscript.ai</span>
                    </p>
                    <p className={darkMode ? "text-zinc-300" : "text-zinc-600"}>
                      {t("Discord")}: <span className="text-teal-600 dark:text-teal-400">discord.gg/echoscript</span>
                    </p>
                    <p className={darkMode ? "text-zinc-300" : "text-zinc-600"}>
                      {t("Follow us on")} <span className={darkMode ? "text-white" : "text-zinc-900"}>X</span>,{" "}
                      <span className={darkMode ? "text-white" : "text-zinc-900"}>Instagram</span>, {t("and")}{" "}
                      <span className={darkMode ? "text-white" : "text-zinc-900"}>LinkedIn</span>.
                    </p>
                  </div>
                </Section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, icon, children, darkMode }) {
  return (
    <section className="mb-7">
      <h2 className={`text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
        {icon && icon} {title}
      </h2>
      {children}
    </section>
  );
}

// Touch-friendly, accessible toggle
function ToggleRow({ label, value, onChange, icon, darkMode, "data-i18n": i18nKey }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all mb-2 ${
      darkMode 
        ? "bg-zinc-800 border-zinc-700 text-zinc-300" 
        : "bg-zinc-50 border-zinc-200 text-zinc-700"
    }`} data-i18n={i18nKey}>
      <div className="flex items-center gap-3 text-sm">
        {icon && <span className="text-teal-600 dark:text-teal-400">{icon}</span>}
        <span>{label}</span>
      </div>
      <Switch
        checked={value}
        onChange={onChange}
        className={`
          ${value ? "bg-teal-600" : "bg-zinc-400 dark:bg-zinc-600"}
          relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400
        `}
        aria-checked={value}
      >
        <span
          className={`
            ${value ? "translate-x-7" : "translate-x-1"}
            inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
          `}
        />
      </Switch>
    </div>
  );
}

// Touch-friendly slider row
function SliderRow({ label, value, onChange, min, max, step, display, darkMode, "data-i18n": i18nKey }) {
  return (
    <div className="flex items-center gap-4 py-2" data-i18n={i18nKey}>
      <p className={`text-sm min-w-[70px] ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{label}</p>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        className={`flex-1 h-2 rounded-lg cursor-pointer accent-teal-500 transition-all ${darkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}
      />
      <span className={`text-xs w-14 text-right ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{display}</span>
    </div>
  );
}
