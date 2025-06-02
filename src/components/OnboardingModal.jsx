// ✅ EchoScript.AI — Interactive OnboardingModal with Lottie Illustrations and Upgraded UX
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import Lottie from "lottie-react";
import animationData from "../assets/ai-waveform.json";
import illustration1 from "../assets/onboarding/upload.json";
import illustration2 from "../assets/onboarding/cleanup.json";
import illustration3 from "../assets/onboarding/global.json";
import illustration4 from "../assets/onboarding/security.json";
import illustration5 from "../assets/onboarding/integrations.json";
import illustration6 from "../assets/onboarding/start.json";

const STEPS = [
  {
    title: "Welcome to EchoScript.AI",
    description: "Upload or record audio. Echo gives you perfect transcripts in seconds.",
    illustration: illustration1,
  },
  {
    title: "Smart Cleanup",
    description: "Remove filler words, summarize, detect tone, and organize your content.",
    illustration: illustration2,
  },
  {
    title: "Global Support",
    description: "Echo understands all voices — English, Spanish, Arabic, and more.",
    illustration: illustration3,
  },
  {
    title: "Privacy First",
    description: "End-to-end encryption, CAPTCHA, and 2FA. Your data stays yours.",
    illustration: illustration4,
  },
  {
    title: "Seamless Uploads",
    description: "Use drag-and-drop, Google Drive, or Dropbox — it’s all built in.",
    illustration: illustration5,
  },
  {
    title: "Let’s Transcribe",
    description: "You’re ready. Pick a plan and start exploring EchoScript.AI.",
    illustration: illustration6,
  },
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (step === STEPS.length - 1) {
      const timer = setTimeout(() => handleClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleClose = () => {
    setDismissed(true);
    localStorage.setItem("onboardingComplete", "true");
    setTimeout(() => onClose?.(), 400);
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
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...swipeHandlers}
        >
          <motion.div
            className="relative w-full max-w-md bg-zinc-900 text-white border border-teal-500 rounded-xl shadow-lg overflow-hidden px-6 py-8"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ❌ Close "X" */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-sm text-zinc-400 hover:text-white transition"
              aria-label="Close"
            >
              ×
            </button>

            {/* 🌟 Illustration */}
            <div className="w-full h-48 flex items-center justify-center">
              <Lottie
                animationData={STEPS[step].illustration}
                loop
                autoplay
                style={{ width: "90%" }}
              />
            </div>

            {/* Title & Description */}
            <motion.div
              key={step}
              className="relative z-10 text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-medium mb-2 font-lemonmilk text-white drop-shadow">
                {STEPS[step].title}
              </h2>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {STEPS[step].description}
              </p>
            </motion.div>

            {/* Step Indicator Dots */}
            <div className="flex justify-center mt-6 space-x-1 z-10">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    i === step ? "bg-teal-400 scale-110" : "bg-zinc-600"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-center items-center gap-4 z-10">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-xs text-zinc-400 hover:text-teal-400 transition"
                >
                  Back
                </button>
              )}
              <button
                onClick={step === STEPS.length - 1 ? handleClose : () => setStep(step + 1)}
                className="text-xs px-4 py-1.5 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {step === STEPS.length - 1 ? "Finish" : "Next"}
              </button>
            </div>

            {/* ⏭️ Skip Link */}
            <div className="text-center mt-4 z-10">
              <button
                onClick={handleClose}
                className="text-xs text-zinc-400 hover:text-white underline transition"
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

