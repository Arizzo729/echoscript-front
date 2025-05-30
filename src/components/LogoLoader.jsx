import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/** LogoLoader: fullscreen animated logo loader */
export default function LogoLoader({ duration = 2000, onComplete }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDone(true);
      if (onComplete) onComplete();
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="/EchoScriptAI_Animated.svg"
            alt="EchoScript.AI Logo Animation"
            className="w-48 h-48"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Steps used in the onboarding modal */
const STEPS = [
  {
    title: "Welcome to EchoScript.AI!",
    description: "Upload your audio or record live, and get perfect transcripts instantly.",
  },
  {
    title: "AI Assistant",
    description: "Ask Echo anything about your transcripts, pricing, or features.",
  },
  {
    title: "Multiple Plans",
    description: "Choose the plan that fits your needs—from free to enterprise.",
  },
];

/** OnboardingModal: separate export */
export function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md mx-4 text-center shadow-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            {STEPS[step].title}
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            {STEPS[step].description}
          </p>
          <div className="flex justify-between">
            <button
              onClick={prev}
              disabled={step === 0}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            {step === STEPS.length - 1 ? (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition"
              >
                Finish
              </button>
            ) : (
              <button
                onClick={next}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition"
              >
                Next
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:underline"
          >
            Skip Intro
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
