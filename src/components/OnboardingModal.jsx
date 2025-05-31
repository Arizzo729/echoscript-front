import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STEPS = [
  {
    title: "👋 Welcome to EchoScript.AI!",
    description:
      "Record or upload your voice. Echo gives you perfect transcripts with smart AI help.",
  },
  {
    title: "💡 Smarter AI Support",
    description:
      "Echo summarizes, detects tone, and helps you clean up your speech with a click.",
  },
  {
    title: "🚀 Choose a Plan",
    description:
      "Use Echo free, or upgrade for more features. Let’s get started!",
  },
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md p-6 mx-4 text-center rounded-2xl shadow-xl bg-white/90 dark:bg-zinc-900/90 border border-teal-400 backdrop-blur-sm"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Step Content */}
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

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-2 mt-2">
            <button
              onClick={prev}
              disabled={step === 0}
              className="w-full py-2 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Back
            </button>
            <button
              onClick={step === STEPS.length - 1 ? onClose : next}
              className="w-full py-2 rounded-md bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium transition"
            >
              {step === STEPS.length - 1 ? "Finish" : "Next"}
            </button>
          </div>

          {/* Skip Option */}
          <button
            onClick={onClose}
            className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 hover:underline transition"
          >
            Skip Intro
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

