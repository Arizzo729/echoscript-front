// ✅ Upgraded Settings.jsx — Organized, Accessible, Modern Preferences

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@headlessui/react";
import {
  Moon,
  Sun,
  HelpCircle,
  Mail,
  Accessibility,
  Settings2,
  Info,
} from "lucide-react";

const tabs = [
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "faq", label: "FAQ", icon: Info },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("preferences");
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [showHints, setShowHints] = useState(true);
  const [accessibleFonts, setAccessibleFonts] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  return (
    <motion.div
      className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Sidebar Tabs */}
      <div className="md:w-1/4 border-r dark:border-gray-700 pr-4">
        <nav className="space-y-3">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === id
                  ? "bg-primary text-white dark:bg-primary-light dark:text-black"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 space-y-8">
        {activeTab === "preferences" && (
          <motion.section key="preferences" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold mb-4">User Preferences</h2>
            <div className="space-y-4">
              <SettingToggle
                label="Enable Dark Mode"
                description="Switch between light and dark themes"
                enabled={darkMode}
                onChange={toggleDarkMode}
                Icon={darkMode ? Moon : Sun}
              />
              <SettingToggle
                label="Show Onboarding Hints"
                description="Display helpful tips during your first use"
                enabled={showHints}
                onChange={() => setShowHints(!showHints)}
                Icon={HelpCircle}
              />
              <SettingToggle
                label="Enable Accessible Fonts"
                description="Use dyslexia-friendly and high-contrast fonts"
                enabled={accessibleFonts}
                onChange={() => setAccessibleFonts(!accessibleFonts)}
                Icon={Accessibility}
              />
            </div>
          </motion.section>
        )}

        {activeTab === "faq" && (
          <motion.section key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <FAQItem question="How accurate are the transcripts?">
              EchoScript uses state-of-the-art AI (Whisper + GPT) to handle muffled audio, accents, and broken grammar with near-human accuracy.
            </FAQItem>
            <FAQItem question="Can I export transcripts?">
              Yes — transcripts can be exported as PDF, DOCX, or copied to clipboard. More integrations coming soon.
            </FAQItem>
            <FAQItem question="Do you store audio or data?">
              By default, we do not store your files. You control what gets saved in your account.
            </FAQItem>
          </motion.section>
        )}

        {activeTab === "contact" && (
          <motion.section key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold mb-4">Contact Support</h2>
            <form className="space-y-4 max-w-lg">
              <input type="text" placeholder="Your name" className="w-full p-2 rounded-md border dark:bg-gray-800 dark:border-gray-700" />
              <input type="email" placeholder="Your email" className="w-full p-2 rounded-md border dark:bg-gray-800 dark:border-gray-700" />
              <select className="w-full p-2 rounded-md border dark:bg-gray-800 dark:border-gray-700">
                <option>Choose a subject</option>
                <option>Technical Issue</option>
                <option>Billing Question</option>
                <option>Feature Request</option>
                <option>Other</option>
              </select>
              <textarea rows={4} placeholder="Describe your issue or request" className="w-full p-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"></textarea>
              <button type="submit" className="bg-primary dark:bg-primary-light text-white dark:text-black px-4 py-2 rounded-md hover:opacity-90 transition">
                Send Message
              </button>
            </form>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}

function SettingToggle({ label, description, enabled, onChange, Icon }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <Icon className="w-5 h-5 text-primary" />
          <span>{label}</span>
        </div>
        <span className="text-gray-500 dark:text-gray-400">{description}</span>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${enabled ? "bg-primary dark:bg-primary-light" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full transition`}
      >
        <span className={`${enabled ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
      </Switch>
    </div>
  );
}

function FAQItem({ question, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border dark:border-gray-700 rounded-md">
      <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 flex justify-between items-center text-left">
        <span className="font-medium">{question}</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">{children}</div>}
    </div>
  );
}
