// ✅ EchoScript.AI — Final Polished Settings Page
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Switch } from "@headlessui/react";
import {
  Moon, Sun, HelpCircle, Mail, Accessibility, Settings2, Info, Text,
  ShieldCheck, FileText, Bell, Globe, Eye, Wand2
} from "lucide-react";
// ...other imports...
import Button from "../components/ui/Button";

export default function SignUp() {
  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <input type="text" placeholder="Name" className="mb-2 w-full" />
      <input type="email" placeholder="Email" className="mb-2 w-full" />
      <input type="password" placeholder="Password" className="mb-4 w-full" />
      <Button variant="primary">Sign Up</Button>
    </div>
  );
}

import { FontSizeContext } from "../context/useFontSize.jsx";

const tabs = [
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "faq", label: "FAQ", icon: Info },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("preferences");
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const [showHints, setShowHints] = useState(true);
  const [accessibleFonts, setAccessibleFonts] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [multiLang, setMultiLang] = useState(true);
  const [aiAssist, setAiAssist] = useState(true);
  const { fontSize, setFontSize } = useContext(FontSizeContext);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
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
      <aside className="md:w-1/4 border-r dark:border-gray-700 pr-4">
        <nav className="space-y-3">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? "bg-gradient-to-br from-teal-500 to-blue-500 text-white shadow-md"
                  : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              aria-current={activeTab === id ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 space-y-10">
        {activeTab === "preferences" && (
          <motion.div key="preferences" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold mb-4">User Preferences</h2>

            <SettingsGroup title="Appearance & Accessibility">
              <SettingToggle label="Enable Dark Mode" description="Toggle between light and dark themes" enabled={darkMode} onChange={toggleDarkMode} Icon={darkMode ? Sun : Moon} />
              <SettingToggle label="Accessible Fonts" description="Enable fonts for better readability" enabled={accessibleFonts} onChange={() => setAccessibleFonts(!accessibleFonts)} Icon={Accessibility} />
              <SettingToggle label="Show Onboarding Hints" description="Helpful tooltips and walkthroughs" enabled={showHints} onChange={() => setShowHints(!showHints)} Icon={HelpCircle} />
              <SettingToggle label="Enable AI Assistant" description="Smart guidance and feature explanations" enabled={aiAssist} onChange={() => setAiAssist(!aiAssist)} Icon={Wand2} />
              <FontSizeSlider value={fontSize} onChange={(e) => setFontSize(Math.min(1.25, Math.max(0.85, parseFloat(e.target.value))))} />
            </SettingsGroup>

            <SettingsGroup title="Notifications & Language">
              <SettingToggle label="App Notifications" description="Get reminders and updates from EchoScript" enabled={notifications} onChange={() => setNotifications(!notifications)} Icon={Bell} />
              <SettingToggle label="Multi-Language Mode" description="Enable translation and detection support" enabled={multiLang} onChange={() => setMultiLang(!multiLang)} Icon={Globe} />
            </SettingsGroup>

            <SettingsGroup title="Account & Data">
              <SettingToggle label="End-to-End Encryption" description="Secure your transcripts with encryption" enabled disabled Icon={ShieldCheck} />
              <SettingToggle label="Auto-Save Transcripts" description="Automatically save to your account" enabled disabled Icon={FileText} />
              <SettingToggle label="Private Mode" description="Disables cloud sync for sensitive projects" enabled={false} onChange={() => {}} Icon={Eye} disabled />
            </SettingsGroup>
          </motion.div>
        )}

        {activeTab === "faq" && <FAQSection />}
        {activeTab === "contact" && <ContactSection />}
      </section>
    </motion.div>
  );
}

// ─────────────────────────────────────
// Components
// ─────────────────────────────────────
function SettingsGroup({ title, children }) {
  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-md font-semibold text-zinc-700 dark:text-zinc-200 mb-2">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingToggle({ label, description, enabled, onChange, Icon, disabled = false }) {
  return (
    <div className={`flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 px-4 py-3 rounded-lg transition ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-white">
          <Icon className="w-5 h-5 text-teal-500" />
          <span>{label}</span>
        </div>
        <span className="text-zinc-500 dark:text-zinc-400">{description}</span>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${enabled ? "bg-teal-500" : "bg-zinc-400"} relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
      >
        <span className={`${enabled ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full transition-transform`} />
      </Switch>
    </div>
  );
}

function FontSizeSlider({ value, onChange }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-3 rounded-lg">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-white">
          <Text className="w-5 h-5 text-teal-500" />
          <span>Font Size</span>
        </div>
        <input
          type="range"
          min="0.85"
          max="1.25"
          step="0.01"
          value={value}
          onChange={onChange}
          className="w-40 accent-teal-500"
        />
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <motion.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      <FAQItem question="How accurate is EchoScript?">EchoScript uses Whisper + GPT to deliver transcripts with near-human accuracy, even on noisy or accented audio.</FAQItem>
      <FAQItem question="Can I export my transcripts?">Yes — PDF, DOCX, copy to clipboard, or export to Notion, Google Docs, and more.</FAQItem>
      <FAQItem question="Is EchoScript secure?">All audio and transcripts are encrypted and not stored unless you choose to save them.</FAQItem>
    </motion.div>
  );
}

function ContactSection() {
  return (
    <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-bold mb-4">Contact Support</h2>
      <form className="space-y-4 max-w-lg" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Your name" required className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm" />
        <input type="email" placeholder="Your email" required className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm" />
        <select required className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm">
          <option value="">Choose a subject</option>
          <option>Technical Issue</option>
          <option>Billing Question</option>
          <option>Feature Request</option>
        </select>
        <textarea rows={4} placeholder="Describe your issue" required className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"></textarea>
        <Button variant="primary" type="submit" className="w-full">Send Message</Button>
      </form>
    </motion.div>
  );
}

function FAQItem({ question, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-md">
      <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 flex justify-between items-center text-left font-medium text-zinc-700 dark:text-white" aria-expanded={open}>
        <span>{question}</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4 text-zinc-600 dark:text-zinc-400">{children}</div>}
    </div>
  );
}
