// src/components/OnboardingModal.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import Lottie from "lottie-react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useSound } from "../context/SoundContext";

const STEPS = [
  { id: "upload", title: "Welcome to EchoScript.AI", description: "Upload or record audio—Echo gives you perfect transcripts in seconds.", filename: "upload.json" },
  { id: "cleanup", title: "Smart Cleanup", description: "Remove filler words, summarize, detect tone, and organize your content.", filename: "cleanup.json" },
  { id: "global", title: "Global Support", description: "Echo understands all voices—English, Spanish, Arabic, and more.", filename: "global.json" },
  { id: "security", title: "Privacy First", description: "End-to-end encryption, CAPTCHA, and 2FA—your data stays yours.", filename: "security.json" },
  { id: "integrations", title: "Seamless Uploads", description: "Use drag-and-drop, Google Drive, or Dropbox—it's all built in.", filename: "integrations.json" },
  { id: "audio", title: "Enable Audio", description: "Turn on microphone support for live recording and voice features.", filename: "start.json" },
  { id: "start", title: "Let's Transcribe", description: "You're ready. Pick a plan and explore EchoScript.AI.", filename: "start.json" },
];

export default function OnboardingModal({ onClose }) {
  const { enableSound } = useSound();
  const [step, setStep] = useState(0);
  const [typedDesc, setTypedDesc] = useState("");
  const [animData, setAnimData] = useState(null);
  const modalRef = useRef(null);

  const finishOnboarding = useCallback(() => {
    localStorage.setItem("onboardingComplete", "true");
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") finishOnboarding();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [finishOnboarding]);

  useEffect(() => {
    let cancelled = false;
    setAnimData(null);
    fetch(`/assets/onboarding/${STEPS[step].filename}`)
      .then(r => r.ok ? r.json() : Promise.reject(`Status ${r.status}`))
      .then(data => !cancelled && setAnimData(data))
      .catch(console.error);
    if (step + 1 < STEPS.length) {
      fetch(`/assets/onboarding/${STEPS[step + 1].filename}`);
    }
    return () => { cancelled = true; };
  }, [step]);

  useEffect(() => {
    const fullText = STEPS[step].description;
    let i = 0;
    setTypedDesc("");
    const speed = 12;
    const interval = setInterval(() => {
      i++;
      setTypedDesc(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [step]);

  const prev = useCallback(() => setStep(s => Math.max(s - 1, 0)), []);
  const next = useCallback(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), []);
  const swipeHandlers = useSwipeable({ onSwipedLeft: next, onSwipedRight: prev, trackMouse: true });
  const progress = ((step + 1) / STEPS.length) * 100;
  const currentStep = STEPS[step];

  return (
    <AnimatePresence>
      { /* Modal Overlay */ }
      <motion.div
        {...swipeHandlers}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        { /* Content Container */ }
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
          aria-describedby="onboarding-desc"
          tabIndex={-1}
          className="relative w-full max-w-md bg-zinc-900/80 text-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-700 backdrop-blur"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
        >
          <button
            onClick={finishOnboarding}
            aria-label="Close onboarding"
            className="absolute top-2.5 right-2.5 text-teal-400 hover:text-teal-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-6 pt-4 flex justify-between items-center">
            <span className="text-xs text-zinc-400">Step {step + 1} of {STEPS.length}</span>
            <div className="flex-1 h-1 bg-zinc-700 mx-3 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="px-6 py-5 flex flex-col items-center text-center"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <div className="w-full h-52 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                {animData ? (
                  <Lottie animationData={animData} loop autoplay style={{ width: '90%', height: '100%' }} />
                ) : (
                  <div className="animate-spin h-8 w-8 border-4 border-teal-400 border-t-transparent rounded-full" />
                )}
              </div>
              <h2 id="onboarding-title" className="text-2xl font-semibold mb-2 tracking-tight">
                {currentStep.title}
              </h2>
              <p id="onboarding-desc" className="text-sm text-zinc-400 leading-relaxed min-h-[3rem]">
                {typedDesc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center px-6 pb-4">
            <button
              onClick={prev}
              disabled={step === 0}
              className="text-sm text-zinc-300 hover:text-white transition disabled:opacity-40"
            >
              ← Back
            </button>
            {step < STEPS.length - 1 && (
              <button
                onClick={next}
                className="text-sm text-teal-300 hover:text-teal-100 transition"
              >
                Next →
              </button>
            )}
          </div>

          {currentStep.id === "audio" && (
            <div className="px-6 pb-4 text-center">
              <button
                onClick={() => {
                  enableSound();
                  setTimeout(() => {
                    step < STEPS.length - 1 ? next() : finishOnboarding();
                  }, 150);
                }}
                className="px-5 py-2 text-sm font-semibold rounded-full bg-teal-500 hover:bg-teal-400 transition w-full"
              >
                Enable Audio
              </button>
            </div>
          )}

          {currentStep.id === "start" && (
            <div className="px-6 pb-5 flex flex-col items-center text-center space-y-2">
              <button
                onClick={finishOnboarding}
                className="px-5 py-2 text-sm font-semibold rounded-full bg-teal-500 hover:bg-teal-400 transition w-full"
              >
                Finish
              </button>
              <button
                onClick={finishOnboarding}
                className="text-xs text-teal-300 hover:underline p-0"
              >
                Do not ask again
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

