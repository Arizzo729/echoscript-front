import React, { useState, useContext } from "react";
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
} from "lucide-react";
import Button from "../components/ui/Button";
import { FontSizeContext } from "../context/useFontSize";
import { useTranslation } from "react-i18next";
import { useSound } from "../context/SoundContext";
import i18n from "../i18n";

const tabs = [
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "faq", label: "FAQ", icon: Info },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("preferences");

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
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

  const currentLang = i18n.language || "en";
  const switchLanguage = () => {
    const newLang = currentLang === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">{t("Settings")}</h1>

      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="space-y-8">
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold mb-2">{t("Appearance & Comfort")}</h2>
            <ToggleRow label={t("Dark Mode") } value={darkMode} onChange={handleDarkToggle} icon={<Moon />} />
            <ToggleRow label={t("Show Helpful Hints")} value={showHints} onChange={() => setShowHints(!showHints)} icon={<Eye />} />
            <ToggleRow label={t("Accessible Fonts")} value={accessibleFonts} onChange={() => setAccessibleFonts(!accessibleFonts)} icon={<Text />} />
          </div>

          <div className="grid gap-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Speaker className="w-5 h-5" /> {t("Sound Settings")}
            </h2>
            <ToggleRow label={t("Sound Effects")} value={!isMuted} onChange={toggleMute} icon={<Volume2 />} />
            <ToggleRow label={t("Ambient Music")} value={ambientEnabled} onChange={toggleAmbient} icon={<Music2 />} />

            <div className="flex justify-between items-center gap-4">
              <p className="text-sm text-zinc-400">{t("Volume")}</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-600 rounded-lg cursor-pointer accent-teal-400"
              />
              <span className="text-xs text-zinc-400 w-10 text-right">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Text className="w-5 h-5" /> {t("Font Size")}
            </h2>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0.8}
                max={1.4}
                step={0.05}
                value={fontSize}
                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                className="w-full accent-teal-500"
              />
              <span className="text-sm text-zinc-400 w-12 text-right">{fontSize.toFixed(2)}x</span>
            </div>
          </div>

          <div className="grid gap-4">
            <h2 className="text-xl font-semibold mb-2">{t("Extras")}</h2>
            <ToggleRow label={t("AI Assistant")} value={aiAssistantEnabled} onChange={() => setAiAssistantEnabled(!aiAssistantEnabled)} icon={<Bot />} />
            <ToggleRow label={t("Push Notifications")} value={notifications} onChange={() => setNotifications(!notifications)} icon={<Bell />} />
            <ToggleRow label={t("Enable Multiple Languages")} value={multiLang} onChange={() => setMultiLang(!multiLang)} icon={<Languages />} />

            {/* Language Toggle */}
            <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Languages className="text-teal-400 w-4 h-4" />
                <span>{t("Language")}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={switchLanguage}
                className="min-w-[90px] text-sm"
              >
                {currentLang === "en" ? "Español" : "English"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="space-y-5">
          {["Why won't my file upload?", "What determines the enterprise estimate?", "Can I buy more minutes?", "How secure is my data?", "What formats are supported?"].map((q, i) => (
            <div key={i} className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
              <p className="text-white font-medium mb-1">{q}</p>
              <Button size="xs" variant="outline">{t("More info")}</Button>
            </div>
          ))}
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-700">
            <h3 className="text-lg font-semibold mb-2">{t("Contact Us")}</h3>
            <p>Email: <span className="text-teal-400">support@echoscript.ai</span></p>
            <p>Discord: <span className="text-teal-400">discord.gg/echoscript</span></p>
            <div className="mt-2 text-sm text-zinc-400">
              {t("Follow us on")}: <span className="text-white">X</span>, <span className="text-white">Instagram</span>, {t("and")} <span className="text-white">LinkedIn</span>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, value, onChange, icon }) {
  return (
    <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-700">
      <div className="flex items-center gap-3 text-sm text-zinc-300">
        {icon && <div className="text-teal-400">{icon}</div>}
        <span>{label}</span>
      </div>
      <Switch
        checked={value}
        onChange={onChange}
        className={`${
          value ? "bg-teal-600" : "bg-zinc-600"
        } relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300`}
      >
        <span
          className={`${
            value ? "translate-x-5" : "translate-x-1"
          } inline-block h-3 w-3 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
}
