// src/pages/Settings.jsx
import React, { useState, useContext, useEffect } from "react";
<<<<<<< Updated upstream
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@headlessui/react";
import {
  Volume2, Music2, Settings2, Info, Mail, Text, Speaker, Languages, Bot, Bell,
  Eye, Moon, User, Star, LogIn, ChevronRight, Clock4
=======
import { motion } from "framer-motion";
import { Switch } from "@headlessui/react";
import {
  Volume2,
  Music2,
  Settings2,
  Info,
  Mail,
  Text,
  Speaker,
  Languages,
  Bot,
  Bell,
  Eye,
  Moon,
  User,
  Star,
  LogIn,
  ChevronRight,
>>>>>>> Stashed changes
} from "lucide-react";
import Button from "../components/ui/Button";
import { FontSizeContext } from "../context/useFontSize";
import { useTranslation } from "react-i18next";
import { useSound } from "../context/SoundContext";
<<<<<<< Updated upstream
import i18n from "i18next";
=======
import i18n from "i18next"; // ✅ Fixed: import i18n
>>>>>>> Stashed changes
import { useAuth } from "../context/AuthContext";

const tabs = [
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "account", label: "Account", icon: User },
  { id: "faq", label: "FAQ", icon: Info },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function Settings() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("preferences");
<<<<<<< Updated upstream
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
=======

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
>>>>>>> Stashed changes
  );
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

  const handleDarkToggle = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

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

<<<<<<< Updated upstream
  // Mobile first: full width, vertical stacking, padding
  return (
    <motion.div
      className="min-h-screen bg-zinc-950/95 dark:bg-zinc-900/95 px-2 sm:px-6 py-6 sm:py-10 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent">
        {t("Settings")}
      </h1>
      {/* Mobile-first tabs: scrollable */}
      <nav className="flex gap-2 overflow-x-auto no-scrollbar mb-6 snap-x">
=======
  return (
    <motion.div
      className="px-6 py-8 max-w-4xl mx-auto text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-6">{t("Settings")}</h1>

      <div className="flex space-x-4 mb-6">
>>>>>>> Stashed changes
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
<<<<<<< Updated upstream
            className={`flex items-center gap-2 px-3 py-2 min-w-[120px] justify-center rounded-xl snap-center shadow
              ${activeTab === tab.id
                ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg"
                : "bg-zinc-800/90 text-zinc-400 hover:bg-zinc-700/80 transition"
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
              <Section title="Appearance & Comfort" icon={<Moon />}>
                <ToggleRow
                  label="Dark Mode"
                  value={darkMode}
                  onChange={handleDarkToggle}
                  icon={<Moon />}
                />
                <ToggleRow
                  label="Show Helpful Hints"
                  value={showHints}
                  onChange={() => setShowHints(!showHints)}
                  icon={<Eye />}
                />
                <ToggleRow
                  label="Accessible Fonts"
                  value={accessibleFonts}
                  onChange={() => setAccessibleFonts(!accessibleFonts)}
                  icon={<Text />}
                />
              </Section>

              <Section title="Sound Settings" icon={<Speaker />}>
                <ToggleRow
                  label="Sound Effects"
                  value={!isMuted}
                  onChange={toggleMute}
                  icon={<Volume2 />}
                />
                <ToggleRow
                  label="Ambient Music"
                  value={ambientEnabled}
                  onChange={toggleAmbient}
                  icon={<Music2 />}
                />
                <SliderRow
                  label="Volume"
                  value={volume}
                  onChange={(val) => setVolume(parseFloat(val))}
                  min={0}
                  max={1}
                  step={0.01}
                  display={`${Math.round(volume * 100)}%`}
                />
              </Section>

              <Section title="Font Size" icon={<Text />}>
                <SliderRow
                  label="Base Size"
                  value={fontSize}
                  onChange={(val) => setFontSize(parseFloat(val))}
                  min={0.8}
                  max={1.4}
                  step={0.05}
                  display={`${fontSize.toFixed(2)}x`}
                />
              </Section>

              <Section title="Extras">
                {isAuthenticated ? (
                  <ToggleRow
                    label="Skip Intro Video"
                    value={localStorage.getItem("skipIntro") === "true"}
                    onChange={() => {
                      const current = localStorage.getItem("skipIntro") === "true";
                      localStorage.setItem("skipIntro", (!current).toString());
                    }}
                    icon={<Eye />}
                  />
                ) : (
                  <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-2xl border border-zinc-700 opacity-60">
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <Eye className="text-teal-400 w-4 h-4" />
                      <span>Skip Intro Video</span>
                    </div>
                    <span className="text-xs text-zinc-500 italic pr-2">
                      Sign in to enable
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-2xl border border-zinc-700 mt-3">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <Clock4 className="text-teal-400 w-4 h-4" />
                    <span>Time Zone</span>
                  </div>
                  <select
                    value={localStorage.getItem("timezone") || "UTC"}
                    onChange={(e) =>
                      localStorage.setItem("timezone", e.target.value)
                    }
                    className="bg-zinc-700 text-white px-3 py-2 rounded-md border border-zinc-600 focus:ring-2 focus:ring-teal-400"
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
                />
                <ToggleRow
                  label="Push Notifications"
                  value={notifications}
                  onChange={() => setNotifications(!notifications)}
                  icon={<Bell />}
                />
                <ToggleRow
                  label="Enable Multiple Languages"
                  value={multiLang}
                  onChange={() => setMultiLang(!multiLang)}
                  icon={<Languages />}
                />
                <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-2xl border border-zinc-700 mt-3">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <Languages className="text-teal-400 w-4 h-4" />
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
              <Section title="Account Settings" icon={<User />}>
                {isAuthenticated ? (
                  <div className="space-y-5">
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-700">
                      <p>
                        <strong>Email:</strong> {user?.email || "your@email.com"}
                      </p>
                      <p>
                        <strong>Plan:</strong>{" "}
                        {localStorage.getItem("fakePlan") || user?.plan || "Pro"}
                      </p>
                      {user?.email === "andrew@echoscript.ai" && (
                        <div className="mt-4">
                          <label className="block text-sm text-white font-medium mb-1">
                            👑 Owner Mode
                          </label>
                          <select
                            value={localStorage.getItem("fakePlan") || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) localStorage.setItem("fakePlan", val);
                              else localStorage.removeItem("fakePlan");
                            }}
                            className="bg-zinc-700 text-white px-3 py-2 rounded-md border border-zinc-600 focus:ring-2 focus:ring-teal-400"
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
                    <p className="text-zinc-300">You’re using EchoScript as a guest.</p>
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
              <Section title="Frequently Asked Questions" icon={<Info />}>
                {[
                  "Why won't my file upload?",
                  "What determines the enterprise estimate?",
                  "Can I buy more minutes?",
                  "How secure is my data?",
                  "What formats are supported?",
                ].map((q, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900 p-4 border border-zinc-700 rounded-2xl mb-2"
                  >
                    <p className="font-medium text-white mb-1">{q}</p>
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
              <Section title="Contact Us" icon={<Mail />}>
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-700 text-sm space-y-2">
                  <p>
                    Email: <span className="text-teal-400">support@echoscript.ai</span>
                  </p>
                  <p>
                    Discord: <span className="text-teal-400">discord.gg/echoscript</span>
                  </p>
                  <p>
                    Follow us on <span className="text-white">X</span>,{" "}
                    <span className="text-white">Instagram</span>, and{" "}
                    <span className="text-white">LinkedIn</span>.
                  </p>
                </div>
              </Section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
=======
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === tab.id
                ? "bg-teal-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {t(tab.label)}
          </button>
        ))}
      </div>

      {activeTab === "preferences" && (
        <div className="space-y-8">
          <Section title="Appearance & Comfort">
            <ToggleRow label="Dark Mode" value={darkMode} onChange={handleDarkToggle} icon={<Moon />} />
            <ToggleRow label="Show Helpful Hints" value={showHints} onChange={() => setShowHints(!showHints)} icon={<Eye />} />
            <ToggleRow label="Accessible Fonts" value={accessibleFonts} onChange={() => setAccessibleFonts(!accessibleFonts)} icon={<Text />} />
          </Section>

          <Section title="Sound Settings" icon={<Speaker />}>
            <ToggleRow label="Sound Effects" value={!isMuted} onChange={toggleMute} icon={<Volume2 />} />
            <ToggleRow label="Ambient Music" value={ambientEnabled} onChange={toggleAmbient} icon={<Music2 />} />
            <SliderRow
              label="Volume"
              value={volume}
              onChange={(val) => setVolume(parseFloat(val))}
              min={0}
              max={1}
              step={0.01}
              display={`${Math.round(volume * 100)}%`}
            />
          </Section>

          <Section title="Font Size" icon={<Text />}>
            <SliderRow
              label="Base Size"
              value={fontSize}
              onChange={(val) => setFontSize(parseFloat(val))}
              min={0.8}
              max={1.4}
              step={0.05}
              display={`${fontSize.toFixed(2)}x`}
            />
          </Section>

          <Section title="Extras">
            <ToggleRow label="AI Assistant" value={aiAssistantEnabled} onChange={() => setAiAssistantEnabled(!aiAssistantEnabled)} icon={<Bot />} />
            <ToggleRow label="Push Notifications" value={notifications} onChange={() => setNotifications(!notifications)} icon={<Bell />} />
            <ToggleRow label="Enable Multiple Languages" value={multiLang} onChange={() => setMultiLang(!multiLang)} icon={<Languages />} />
            <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Languages className="text-teal-400 w-4 h-4" />
                <span>{t("Language")}</span>
              </div>
              <Button size="sm" variant="outline" onClick={switchLanguage}>
                {i18n.language === "en" ? "Español" : "English"}
              </Button>
            </div>
          </Section>
        </div>
      )}

      {activeTab === "account" && (
        <Section title="Account Settings" icon={<User />}>
          {isAuthenticated ? (
            <div className="grid gap-4">
              <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                <p><strong>Email:</strong> {user?.email || "your@email.com"}</p>
                <p><strong>Plan:</strong> {localStorage.getItem("fakePlan") || user?.plan || "Pro"}</p>

                {user?.email === "andrew@echoscript.ai" && (
                  <div className="mt-4">
                    <label className="block text-sm text-white font-medium mb-1">👑 Owner Mode</label>
                    <select
                      value={localStorage.getItem("fakePlan") || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) localStorage.setItem("fakePlan", val);
                        else localStorage.removeItem("fakePlan");
                      }}
                      className="bg-zinc-700 text-white px-3 py-1 rounded-md border border-zinc-600"
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
            <div className="grid gap-3">
              <p className="text-zinc-300">You’re using EchoScript as a guest.</p>
              <Button variant="primary" icon={<LogIn />} fullWidth>
                Create Account
              </Button>
              <Button variant="outline" icon={<ChevronRight />} fullWidth>
                Learn About Plans
              </Button>
            </div>
          )}
        </Section>
      )}

      {activeTab === "faq" && (
        <Section title="Frequently Asked Questions" icon={<Info />}>
          {["Why won't my file upload?","What determines the enterprise estimate?","Can I buy more minutes?","How secure is my data?","What formats are supported?"].map((q, i) => (
            <div key={i} className="bg-zinc-900 p-4 border border-zinc-700 rounded-lg">
              <p className="font-medium text-white mb-1">{q}</p>
              <Button size="xs" variant="outline">{t("More info")}</Button>
            </div>
          ))}
        </Section>
      )}

      {activeTab === "contact" && (
        <Section title="Contact Us" icon={<Mail />}>
          <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-700 text-sm space-y-2">
            <p>Email: <span className="text-teal-400">support@echoscript.ai</span></p>
            <p>Discord: <span className="text-teal-400">discord.gg/echoscript</span></p>
            <p>Follow us on <span className="text-white">X</span>, <span className="text-white">Instagram</span>, and <span className="text-white">LinkedIn</span>.</p>
          </div>
        </Section>
      )}
>>>>>>> Stashed changes
    </motion.div>
  );
}

function Section({ title, icon, children }) {
  return (
<<<<<<< Updated upstream
    <section className="mb-7">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
        {icon && icon} {title}
      </h2>
      {children}
    </section>
  );
}

// Touch-friendly, accessible toggle
function ToggleRow({ label, value, onChange, icon }) {
  return (
    <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-2xl border border-zinc-700 transition-all mb-2">
      <div className="flex items-center gap-3 text-sm text-zinc-300">
        {icon && <span className="text-teal-400">{icon}</span>}
=======
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        {icon && icon} {title}
      </h2>
      {children}
    </div>
  );
}

function ToggleRow({ label, value, onChange, icon }) {
  return (
    <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-700 transition-all duration-300">
      <div className="flex items-center gap-3 text-sm text-zinc-300">
        {icon && <div className="text-teal-400">{icon}</div>}
>>>>>>> Stashed changes
        <span>{label}</span>
      </div>
      <Switch
        checked={value}
        onChange={onChange}
<<<<<<< Updated upstream
        className={`
          ${value ? "bg-teal-600" : "bg-zinc-600"}
          relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400
        `}
        aria-checked={value}
      >
        <span
          className={`
            ${value ? "translate-x-7" : "translate-x-1"}
            inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
          `}
=======
        className={`${
          value ? "bg-teal-600" : "bg-zinc-600"
        } relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ease-in-out`}
      >
        <span
          className={`${
            value ? "translate-x-5" : "translate-x-1"
          } inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300`}
>>>>>>> Stashed changes
        />
      </Switch>
    </div>
  );
}

<<<<<<< Updated upstream
// Touch-friendly slider row
function SliderRow({ label, value, onChange, min, max, step, display }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <p className="text-sm text-zinc-400 min-w-[70px]">{label}</p>
=======
function SliderRow({ label, value, onChange, min, max, step, display }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-sm text-zinc-400">{label}</p>
>>>>>>> Stashed changes
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
<<<<<<< Updated upstream
        className="flex-1 h-2 bg-zinc-700 rounded-lg cursor-pointer accent-teal-500 transition-all"
      />
      <span className="text-xs text-zinc-400 w-14 text-right">{display}</span>
    </div>
  );
}
=======
        className="w-full h-2 bg-zinc-700 rounded-lg cursor-pointer accent-teal-500 transition-all duration-300"
      />
      <span className="text-xs text-zinc-400 w-12 text-right">{display}</span>
    </div>
  );
}

>>>>>>> Stashed changes
