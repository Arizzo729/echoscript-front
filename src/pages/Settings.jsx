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

  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const [ambientStyle, setAmbientStyle] = useState("lofi");

  const handleDarkToggle = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

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
            <h2 className="text-xl font-semibold mb-2">Appearance & Comfort</h2>
            <ToggleRow label="Dark Mode" value={darkMode} onChange={handleDarkToggle} icon={<Moon />} />
            <ToggleRow label="Show Helpful Hints" value={showHints} onChange={() => setShowHints(!showHints)} icon={<Eye />} />
            <ToggleRow label="Accessible Fonts" value={accessibleFonts} onChange={() => setAccessibleFonts(!accessibleFonts)} icon={<Text />} />
          </div>

          <div className="grid gap-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Speaker className="w-5 h-5" /> Ambient Sound
            </h2>
            <div className="flex justify-between items-center gap-4">
              <p className="text-sm text-zinc-400">Volume</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-48 h-2 bg-zinc-600 rounded-lg cursor-pointer accent-teal-400"
              />
            </div>
            <div className="flex justify-between items-center gap-4">
              <p className="text-sm text-zinc-400">Style</p>
              <select
                value={ambientStyle}
                onChange={(e) => setAmbientStyle(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-md w-48"
              >
                <option value="lofi">Lofi</option>
                <option value="nature">Nature</option>
                <option value="focus">Focus</option>
                <option value="ambient">Ambient</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Text className="w-5 h-5" /> Font Size
            </h2>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0.8}
                max={1.4}
                step={0.05}
                value={fontSize}
                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                className="w-48 accent-teal-500"
              />
              <span className="text-sm text-zinc-400">{fontSize.toFixed(2)}x</span>
            </div>
          </div>

          <div className="grid gap-4">
            <h2 className="text-xl font-semibold mb-2">Extras</h2>
            <ToggleRow label="AI Assistant" value={aiAssistantEnabled} onChange={() => setAiAssistantEnabled(!aiAssistantEnabled)} icon={<Bot />} />
            <ToggleRow label="Push Notifications" value={notifications} onChange={() => setNotifications(!notifications)} icon={<Bell />} />
            <ToggleRow label="Enable Multiple Languages" value={multiLang} onChange={() => setMultiLang(!multiLang)} icon={<Languages />} />
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="space-y-5">
          {[
            "Why won't my file upload?",
            "What determines the enterprise estimate?",
            "Can I buy more minutes?",
            "How secure is my data?",
            "What formats are supported?",
          ].map((q, i) => (
            <div key={i} className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
              <p className="text-white font-medium mb-1">{q}</p>
              <Button size="xs" variant="outline">More info</Button>
            </div>
          ))}
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-700">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p>Email: <span className="text-teal-400">support@echoscript.ai</span></p>
            <p>Discord: <span className="text-teal-400">discord.gg/echoscript</span></p>
            <div className="mt-2 text-sm text-zinc-400">
              Follow us on <span className="text-white">X</span>, <span className="text-white">Instagram</span>, and <span className="text-white">LinkedIn</span>.
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

