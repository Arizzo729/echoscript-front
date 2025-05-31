import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STEPS = [
  {
    title: "👋 Welcome to EchoScript.AI!",
    description: "Start by uploading or recording your voice. EchoScript listens with care.",
  },
  {
    title: "🤖 Smarter AI Feedback",
    description: "Echo summarizes, detects tone, and suggests edits instantly.",
  },
  {
    title: "📦 Choose a Plan",
    description: "Try it free, or upgrade for cleaner transcripts and AI boosts.",
  },
  {
    title: "☁️ Upload Anywhere",
    description: "Connect Google Drive or Dropbox to sync and transcribe instantly.",
  },
  {
    title: "🔐 Your Data is Safe",
    description: "We use 2FA, encryption, and zero-retention for maximum privacy.",
  },
  {
    title: "🌍 Choose Language",
    description: "Echo supports English, Español, Français, 中文 and more (coming soon).",
  },
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const ref = useRef(null);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // Close on ESC key or click outside
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={ref}
          className="relative w-full max-w-md px-6 py-8 mx-4 text-center rounded-2xl shadow-2xl bg-white/90 dark:bg-zinc-900/90 border border-teal-400 backdrop-blur-sm"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 210, damping: 20 }}
        >
          {/* ❌ X Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* 🔘 Progress Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition ${
                  i === step
                    ? "bg-teal-500 scale-125"
                    : "bg-zinc-400 dark:bg-zinc-600 opacity-50"
                }`}
              />
            ))}
          </div>

          {/* 📝 Step content */}
          <motion.div
            key={step}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h2 className="text-2xl font-semibold mb-2 text-zinc-800 dark:text-white tracking-tight">
              {STEPS[step].title}
            </h2>
            <p className="mb-6 text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {STEPS[step].description}
            </p>
          </motion.div>

          {/* ⬅️➡️ Navigation */}
          <div className="flex justify-between gap-2 mt-4">
            <motion.button
              onClick={prev}
              disabled={step === 0}
              className="w-full py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 disabled:opacity-40 hover:scale-105 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              whileTap={{ scale: 0.95 }}
            >
              Back
            </motion.button>
            <motion.button
              onClick={step === STEPS.length - 1 ? onClose : next}
              className="w-full py-2 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-semibold hover:scale-105 hover:from-teal-500 hover:to-emerald-600 transition-all"
              whileTap={{ scale: 0.95 }}
            >
              {step === STEPS.length - 1 ? "Let’s Go!" : "Next"}
            </motion.button>
          </div>

          {/* 🧭 Skip Link */}
          <button
            onClick={onClose}
            className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 hover:text-teal-400 transition"
          >
            Skip Intro
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

