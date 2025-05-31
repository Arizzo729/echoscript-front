import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { X } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../assets/ai-waveform.json";
import Button from "./ui/Button";

const STEPS = [
  {
    title: "👋 Welcome to EchoScript.AI",
    description:
      "Upload or record your voice. Echo delivers flawless transcripts with advanced AI understanding.",
  },
  {
    title: "💡 Smarter AI Help",
    description:
      "Summarize, clean, detect tone, extract keywords — Echo makes your transcripts powerful.",
  },
  {
    title: "🌍 Understands Every Voice",
    description:
      "Supports English, Spanish, Chinese, Arabic, and more — Echo understands you clearly.",
  },
  {
    title: "🔐 Built-In Security",
    description:
      "CAPTCHA, 2FA, and full encryption protect your files and privacy by default.",
  },
  {
    title: "📤 Connected Uploads",
    description:
      "Upload from your device, Dropbox, or Google Drive. Fully integrated.",
  },
  {
    title: "🚀 Ready to Transcribe",
    description:
      "Free and pro plans available. Start your best transcription experience now.",
  },
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Auto-dismiss on final step
  useEffect(() => {
    if (step === STEPS.length - 1) {
      const timeout = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  const handleClose = () => {
    localStorage.setItem("onboardingComplete", "true");
    setDismissed(true);
    setTimeout(() => onClose?.(), 300);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
    onSwipedRight: () => setStep((s) => Math.max(s - 1, 0)),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...swipeHandlers}
        >
          <motion.div
            className="relative w-full max-w-lg mx-4 p-6 overflow-hidden rounded-2xl border border-teal-500 shadow-2xl bg-white/90 dark:bg-zinc-900/90"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Lottie background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
              <Lottie
                animationData={animationData}
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Close icon */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Slide content */}
            <motion.div
              key={step}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative z-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-white mb-2">
                {STEPS[step].title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {STEPS[step].description}
              </p>
            </motion.div>

            {/* Dots */}
            <div className="flex justify-center mt-5 gap-1 relative z-10">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    i === step
                      ? "bg-teal-500 scale-110"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-3 mt-6 relative z-10">
              <Button
                variant="secondary"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
                className="w-full"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={
                  step === STEPS.length - 1
                    ? handleClose
                    : () => setStep(step + 1)
                }
                className="w-full"
              >
                {step === STEPS.length - 1 ? "Let's Go" : "Next"}
              </Button>
            </div>

            {/* Skip */}
            <div className="text-center mt-4 relative z-10">
              <button
                onClick={handleClose}
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-teal-500"
              >
                Skip Intro
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

