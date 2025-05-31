import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import Lottie from "lottie-react";
import animationData from "../assets/ai-waveform.json";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (step === STEPS.length - 1) {
      const timer = setTimeout(() => handleClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleClose = () => {
    setDismissed(true);
    localStorage.setItem("onboardingComplete", "true");

    // Delay navigation until animation finishes
    setTimeout(() => {
      onClose?.();
      navigate("/dashboard");
    }, 500);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
    onSwipedRight: () => setStep((s) => Math.max(s - 1, 0)),
    trackMouse: true
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
            {/* X button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-5 text-white/50 hover:text-white text-xl transition-opacity"
              aria-label="Close"
            >
              ×
            </button>

            {/* Background animation */}
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
            <div className="flex justify-center mt-5 gap-2 relative z-10">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    i === step ? "bg-teal-400 scale-125" : "bg-zinc-700"
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-3 mt-6 z-10">
              <button
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
                className="w-full py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-sm border border-zinc-600 transition"
              >
                Back
              </button>
              <button
                onClick={step === STEPS.length - 1 ? handleClose : () => setStep(step + 1)}
                className="w-full py-2 rounded-md bg-teal-600 hover:bg-teal-500 text-white text-sm shadow-md transition"
              >
                {step === STEPS.length - 1 ? "Start" : "Next"}
              </button>
            </div>

            {/* Skip link */}
            <div className="text-center mt-4 z-10 relative">
              <button
                onClick={handleClose}
                className="text-xs text-zinc-400 hover:text-teal-400 transition"
              >
                Skip
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
