// ✅ EchoScript.AI — Final Settings with Ambient Volume & Style
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
} from "lucide-react";
import Button from "../components/ui/Button";
import { FontSizeContext } from "../context/useFontSize";
import { useTranslation } from "react-i18next";

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

  // Ambient audio settings
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const [ambientStyle, setAmbientStyle] = useState("lofi");

  const handleDarkToggle = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">{t("User Preferences")}</h1>

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

      {/* Preferences Panel */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t("Appearance & Accessibility")}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{t("Enable Dark Mode")}</p>
                  <p className="text-sm text-zinc-400">{t("Toggle between light and dark themes")}</p>
                </div>
                <Switch
                  checked={darkMode}
                  onChange={handleDarkToggle}
                  className={`${darkMode ? "bg-teal-500" : "bg-zinc-700"} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">{t("Enable Dark Mode")}</span>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
                </Switch>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{t("Accessible Fonts")}</p>
                  <p className="text-sm text-zinc-400">{t("Enable fonts for better readability")}</p>
                </div>
                <Switch
                  checked={accessibleFonts}
                  onChange={setAccessibleFonts}
                  className={`${accessibleFonts ? "bg-teal-500" : "bg-zinc-700"} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">{t("Accessible Fonts")}</span>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${accessibleFonts ? "translate-x-6" : "translate-x-1"}`} />
                </Switch>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{t("Show Onboarding Hints")}</p>
                  <p className="text-sm text-zinc-400">{t("Helpful tooltips and walkthroughs")}</p>
                </div>
                <Switch
                  checked={showHints}
                  onChange={setShowHints}
                  className={`${showHints ? "bg-teal-500" : "bg-zinc-700"} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">{t("Show Onboarding Hints")}</span>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${showHints ? "translate-x-6" : "translate-x-1"}`} />
                </Switch>
              </div>
            </div>
          </div>

          {/* Ambient Sound Section */}
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Speaker className="w-5 h-5" />
              Ambient Sound
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-zinc-400">Volume</p>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                  className="w-64 h-2 bg-zinc-600 rounded-lg cursor-pointer accent-teal-400"
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-zinc-400">Style</p>
                <select
                  value={ambientStyle}
                  onChange={(e) => setAmbientStyle(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-md w-64"
                >
                  <option value="lofi">Lofi</option>
                  <option value="nature">Nature</option>
                  <option value="focus">Focus</option>
                  <option value="ambient">Ambient</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          </div>

          {/* Font size */}
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Text className="w-5 h-5" />
              {t("Font Size")}
            </h2>
            <input
              type="range"
              min={0.8}
              max={1.4}
              step={0.05}
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
