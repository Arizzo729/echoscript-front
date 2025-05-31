import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import Lottie from "lottie-react";
import animationData from "../assets/ai-waveform.json";
import Button from "./ui/Button";

const STEPS = [
  { title: "👋 Welcome to EchoScript.AI", description: "Upload or record audio. Echo gives you perfect transcripts in seconds." },
  { title: "🧠 Smart Cleanup", description: "Remove filler words, summarize, detect tone, and organize your content." },
  { title: "🌍 Global Support", description: "English, Spanish, Arabic, Chinese — Echo understands all voices." },
  { title: "🔐 Privacy First", description: "End-to-end encryption, CAPTCHA, and 2FA. Your data stays yours." },
  { title: "📤 Integrated Uploads", description: "Connect Google Drive, Dropbox, or drag-and-drop files." },
  { title: "🚀 Let's Transcribe", description: "You're ready to begin. Pick a plan and start exploring EchoScript.AI." }
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (step === STEPS.length - 1) {
      const timer = setTimeout(handleClose, 4000);
      return () => clearTimeout(timer);
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
    preventScrollOnSwipe: true
  });

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...swipeHandlers}
        >
          <motion.div
            className="relative max-w-md w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-teal-500 rounded-3xl shadow-xl overflow-hidden p-6 backdrop-blur-lg bg-opacity-90"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Clean semi-transparent X button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-5 text-white/60 hover:text-white transition text-xl z-10"
              aria-label="Close"
            >
              ×
            </button>

            {/* Lottie background */}
            <div className="absolute inset-0 pointer-events-none opacity-10 blur-sm">
              <Lottie animationData={animationData} loop autoplay style={{ width: "100%", height: "100%" }} />
            </div>

            {/* Step content */}
            <motion.div
              key={step}
              className="relative z-10 text-center"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">{STEPS[step].title}</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">{STEPS[step].description}</p>
            </motion.div>

            {/* Step indicators */}
            <div className="flex justify-center mt-5 gap-2 z-10 relative">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    i === step ? "bg-teal-400 shadow-md scale-110" : "bg-zinc-700"
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
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
                onClick={step === STEPS.length - 1 ? handleClose : () => setStep(step + 1)}
                className="w-full"
              >
                {step === STEPS.length - 1 ? "Start" : "Next"}
              </Button>
            </div>

            {/* Skip link */}
            <div className="text-center mt-4 z-10 relative">
              <button
                onClick={handleClose}
                className="text-sm text-zinc-400 hover:text-teal-400 transition"
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


