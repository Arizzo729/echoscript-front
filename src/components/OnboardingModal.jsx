import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import Lottie from "lottie-react";
import animationData from "../assets/ai-waveform.json";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { title: "👋 Welcome to EchoScript.AI", description: "Upload or record audio. Echo gives you perfect transcripts in seconds." },
  { title: "🧠 Smart Cleanup", description: "Remove filler words, summarize, detect tone, and organize your content." },
  { title: "🌍 Global Support", description: "Echo understands all voices — English, Spanish, Arabic, Chinese, and more." },
  { title: "🔐 Privacy First", description: "End-to-end encryption, CAPTCHA, and 2FA. Your data stays yours." },
  { title: "📤 Integrated Uploads", description: "Drag-and-drop, Google Drive, or Dropbox support is built in." },
  { title: "🚀 Let’s Transcribe", description: "You're ready! Pick a plan and explore everything EchoScript.AI offers." }
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
    setTimeout(() => {
      onClose?.();
      navigate("/dashboard");
    }, 500);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
    onSwipedRight: () => setStep((s) => Math.max(s - 1, 0)),
    trackMouse: true,
  });

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...swipeHandlers}
        >
          <motion.div
            className="relative max-w-lg w-full bg-zinc-900 text-white border border-teal-500 rounded-2xl shadow-2xl overflow-hidden p-6"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ❌ Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 text-white text-lg bg-zinc-800 hover:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center transition"
              aria-label="Close"
            >
              &times;
            </button>

            {/* 🌊 Background Animation */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
              <Lottie animationData={animationData} loop autoplay style={{ width: "100%", height: "100%" }} />
            </div>

            {/* 💬 Main Step Content */}
            <motion.div
              key={step}
              className="relative z-10 text-center px-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-2">{STEPS[step].title}</h2>
              <p className="text-base text-zinc-400">{STEPS[step].description}</p>
            </motion.div>

            {/* 🔘 Step Indicators */}
            <div className="flex justify-center mt-6 space-x-2 z-10 relative">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    i === step ? "bg-teal-400 scale-110 shadow-md" : "bg-zinc-600"
                  }`}
                />
              ))}
            </div>

            {/* 🧭 Navigation Buttons */}
            <div className="mt-6 flex gap-4 z-10 relative">
              <button
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
                className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-white border border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={step === STEPS.length - 1 ? handleClose : () => setStep(step + 1)}
                className="flex-1 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-sm text-white font-medium shadow-lg"
              >
                {step === STEPS.length - 1 ? "Finish" : "Next"}
              </button>
            </div>

            {/* 🧼 Skip Option */}
            <div className="text-center mt-4 z-10 relative">
              <button
                onClick={handleClose}
                className="text-xs text-zinc-400 hover:text-teal-400 transition"
              >
                Skip Introduction
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
