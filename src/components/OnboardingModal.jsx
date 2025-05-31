import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STEPS = [
  {
    title: "Welcome to EchoScript.AI",
    description: "Upload audio, record live, and get stunningly accurate transcripts — instantly.",
  },
  {
    title: "Meet Echo",
    description: "Echo is your smart assistant. Summarize, fix grammar, or even research via commands.",
  },
  {
    title: "Flexible Plans",
    description: "Start free or scale up with premium features, integrations, and unlimited transcription.",
  },
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  useEffect(() => {
    const handleKeys = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [step]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-white/20 dark:border-zinc-700 rounded-3xl px-8 py-10 max-w-lg w-full shadow-2xl overflow-hidden mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Title + Description */}
          <motion.div
            key={step}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-3">
              {STEPS[step].title}
            </h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {STEPS[step].description}
            </p>
          </motion.div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === step
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg scale-110"
                    : "bg-zinc-300 dark:bg-zinc-700"
                }`}
                layout
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 mt-8">
            <button
              onClick={prev}
              disabled={step === 0}
              className="w-full py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 disabled:opacity-40 transition"
            >
              Previous
            </button>
            <button
              onClick={isLast ? onClose : next}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:opacity-90 transition"
            >
              {isLast ? "Finish" : "Next"}
            </button>
          </div>

          {/* Skip */}
          {!isLast && (
            <button
              onClick={onClose}
              className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 hover:underline"
            >
              Skip Intro
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

