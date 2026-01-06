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

  const switchLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
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
                <Section title="Appearance & Comfort" icon={<Moon className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  <ToggleRow
                    label="Dark Mode"
                    value={darkMode}
                    onChange={toggleTheme}
                    icon={<Moon />}
                    darkMode={darkMode}
                  />
                  <ToggleRow
                    label="Show Helpful Hints"
                    value={showHints}
                    onChange={() => setShowHints(!showHints)}
                    icon={<Eye />}
                    darkMode={darkMode}
                  />
                  <ToggleRow
                    label="Accessible Fonts"
                    value={accessibleFonts}
                    onChange={() => setAccessibleFonts(!accessibleFonts)}
                    icon={<Text />}
                    darkMode={darkMode}
                  />
                </Section>

                <Section title="Sound Settings" icon={<Speaker className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  <ToggleRow
                    label="Sound Effects"
                    value={!isMuted}
                    onChange={toggleMute}
                    icon={<Volume2 />}
                    darkMode={darkMode}
                  />
                  <ToggleRow
                    label="Ambient Music"
                    value={ambientEnabled}
                    onChange={toggleAmbient}
                    icon={<Music2 />}
                    darkMode={darkMode}
                  />
                  <SliderRow
                    label="Volume"
                    value={volume}
                    onChange={(val) => setVolume(parseFloat(val))}
                    min={0}
                    max={1}
                    step={0.01}
                    display={`${Math.round(volume * 100)}%`}
                    darkMode={darkMode}
                  />
                </Section>

                <Section title="Font Size" icon={<Text className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  <SliderRow
                    label="Base Size"
                    value={fontSize}
                    onChange={(val) => setFontSize(parseFloat(val))}
                    min={0.8}
                    max={1.4}
                    step={0.05}
                    display={`${fontSize.toFixed(2)}x`}
                    darkMode={darkMode}
                  />
                </Section>

                <Section title="Extras" darkMode={darkMode}>
                  {isAuthenticated ? (
                    <ToggleRow
                      label="Skip Intro Video"
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
                        <span>Skip Intro Video</span>
                      </div>
                      <span className="text-xs text-zinc-500 italic pr-2">
                        Sign in to enable
                      </span>
                    </div>
                  )}

                  <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border mt-3 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <Clock4 className="text-teal-600 dark:text-teal-400 w-4 h-4" />
                      <span>Time Zone</span>
                    </div>
                    <select
                      value={localStorage.getItem("timezone") || "UTC"}
                      onChange={(e) =>
                        localStorage.setItem("timezone", e.target.value)
                      }
                      className={`px-3 py-2 rounded-md border focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-zinc-700 text-white border-zinc-600' : 'bg-white text-zinc-900 border-zinc-300'}`}
                    >
                      {["UTC", "EST", "CST", "MST", "PST", "GMT", "CET"].map((tz) => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  <ToggleRow
                    label="AI Assistant"
                    value={aiAssistantEnabled}
                    onChange={() => setAiAssistantEnabled(!aiAssistantEnabled)}
                    icon={<Bot />}
                    darkMode={darkMode}
                  />
                  <ToggleRow
                    label="Push Notifications"
                    value={notifications}
                    onChange={() => setNotifications(!notifications)}
                    icon={<Bell />}
                    darkMode={darkMode}
                  />
                  <ToggleRow
                    label="Enable Multiple Languages"
                    value={multiLang}
                    onChange={() => setMultiLang(!multiLang)}
                    icon={<Languages />}
                    darkMode={darkMode}
                  />
                  <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border mt-3 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <Languages className="text-teal-600 dark:text-teal-400 w-4 h-4" />
                      <span>{t("Language")}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={switchLanguage}>
                      {i18n.language === "en" ? "Español" : "English"}
                    </Button>
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
                <Section title="Account Settings" icon={<User className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  {isAuthenticated ? (
                    <div className="space-y-5">
                      <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>
                        <p>
                          <strong>Email:</strong> {user?.email || "your@email.com"}
                        </p>
                        <p>
                          <strong>Plan:</strong>{" "}
                          {localStorage.getItem("fakePlan") || user?.plan || "Pro"}
                        </p>
                        {user?.email === "andrew@echoscript.ai" && (
                          <div className="mt-4">
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                              👑 Owner Mode
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
                              <option value="">(Your Real Plan)</option>
                              <option value="Guest">View as Guest</option>
                              <option value="Pro">View as Pro</option>
                              <option value="Enterprise">View as Enterprise</option>
                            </select>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" icon={<Star />} fullWidth>
                        Manage Subscription
                      </Button>
                      <Button variant="destructive" fullWidth>
                        Delete Account
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className={darkMode ? "text-zinc-300" : "text-zinc-600"}>You’re using EchoScript as a guest.</p>
                      <Button variant="primary" icon={<LogIn />} fullWidth>
                        Create Account
                      </Button>
                      <Button variant="outline" icon={<ChevronRight />} fullWidth>
                        Learn About Plans
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
                <Section title="Frequently Asked Questions" icon={<Info className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  {[
                    "Why won't my file upload?",
                    "What determines the enterprise estimate?",
                    "Can I buy more minutes?",
                    "How secure is my data?",
                    "What formats are supported?",
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
                <Section title="Contact Us" icon={<Mail className="text-teal-600 dark:text-teal-400" />} darkMode={darkMode}>
                  <div className={`rounded-2xl p-5 border text-sm space-y-2 ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                    <p className={darkMode ? "text-zinc-300" : "text-zinc-600"}>
                      Email: <span className="text-teal-600 dark:text-teal-400">support@echoscript.ai</span>
                    </p>
                    <p className={darkMode ? "text-zinc-300" : "text-zinc-600"}>
                      Discord: <span className="text-teal-600 dark:text-teal-400">discord.gg/echoscript</span>
                    </p>
                    <p className={darkMode ? "text-zinc-300" : "text-zinc-600"}>
                      Follow us on <span className={darkMode ? "text-white" : "text-zinc-900"}>X</span>,{" "}
                      <span className={darkMode ? "text-white" : "text-zinc-900"}>Instagram</span>, and{" "}
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
function ToggleRow({ label, value, onChange, icon, darkMode }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all mb-2 ${
      darkMode 
        ? "bg-zinc-800 border-zinc-700 text-zinc-300" 
        : "bg-zinc-50 border-zinc-200 text-zinc-700"
    }`}>
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
function SliderRow({ label, value, onChange, min, max, step, display, darkMode }) {
  return (
    <div className="flex items-center gap-4 py-2">
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
