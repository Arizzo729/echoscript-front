<<<<<<< Updated upstream
// src/components/OnboardingModal.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import IntroVideo from './IntroVideo';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import Lottie from 'lottie-react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useSound } from '../context/SoundContext';

// Allow external step injection if you ever want it: window.__ONBOARDING_STEPS = [...]
const STEPS = Array.isArray(window?.__ONBOARDING_STEPS) && window.__ONBOARDING_STEPS.length
  ? window.__ONBOARDING_STEPS
  : []; // default: empty → show minimal welcome instead of 1/0

export default function OnboardingModal({ onClose }) {
  const { playClick, enableSound } = useSound();
  const shouldReduce = useReducedMotion();

  // Skip the intro video for now (avoids asset path issues); set to `true` if your IntroVideo is ready.
  const [showVideo, setShowVideo] = useState(false);

  const [step, setStep] = useState(0);
  const [typedDesc, setTypedDesc] = useState('');
  const [animData, setAnimData] = useState(null);
  const modalRef = useRef(null);

  const handleVideoFinish = useCallback(() => setShowVideo(false), []);
  const finishOnboarding = useCallback(() => {
    localStorage.setItem('onboardingComplete', 'true');
    onClose?.();
  }, [onClose]);

  useEffect(() => modalRef.current?.focus(), []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') finishOnboarding();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [finishOnboarding]);

  const next = () => {
    if (STEPS.length === 0) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      playClick();
    }
  };

  const prev = () => {
    if (STEPS.length === 0) return;
    if (step > 0) {
      setStep((s) => s - 1);
      playClick();
    }
  };

  // Load lottie for the current step (if any)
  useEffect(() => {
    if (!STEPS.length) return;
    let cancel = false;
    setAnimData(null);
    const currentStep = STEPS?.[step];
    if (!currentStep || !currentStep.filename) return;

    const controller = new AbortController();
    fetch(`/assets/onboarding/${currentStep.filename}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => !cancel && setAnimData(data))
      .catch(() => {});
    return () => {
      cancel = true;
      controller.abort();
    };
  }, [step]);

  // Type the step description
  useEffect(() => {
    if (!STEPS.length) return;
    const current = STEPS?.[step];
    const full = current?.description || '';
    let idx = 0;
    setTypedDesc('');
    const speed = 30;
    const timer = setInterval(() => {
      idx++;
      setTypedDesc(full.slice(0, idx));
      if (idx >= full.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [step]);

  const swipe = useSwipeable({ onSwipedLeft: next, onSwipedRight: prev, trackMouse: true });
  const totalSteps = Math.max(1, STEPS.length);
  const progress = ((Math.min(step + 1, totalSteps)) / totalSteps) * 100;
  const current = STEPS?.[step] || {};

  if (showVideo) {
    return <IntroVideo onFinish={handleVideoFinish} skipAfter={3} skipLabel="Skip Intro" />;
  }

  // Minimal welcome if there are no steps configured
  if (!STEPS.length) {
    return ReactDOM.createPortal(
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            tabIndex={-1}
            className="relative w-full max-w-md bg-zinc-900/90 text-white rounded-2xl shadow-xl border border-zinc-700 overflow-hidden p-6 text-center"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <button onClick={finishOnboarding} className="absolute top-3 right-3 text-zinc-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-2">Welcome to EchoScript</h2>
            <p className="text-sm text-zinc-300 mb-5">
              You’re all set. We’ll show the full tour later — enjoy exploring!
            </p>
            <button onClick={finishOnboarding} className="px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-400 font-semibold">
              Finish
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  }

  // Full onboarding when steps exist
  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        {...swipe}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
=======
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import Lottie from "lottie-react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useSound } from "../context/SoundContext"; // ✅ integrate sound context

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
  const { enableSound } = useSound(); // ✅ use SoundContext directly
  const [step, setStep] = useState(0);
  const [typedDesc, setTypedDesc] = useState("");
  const [animData, setAnimData] = useState(null);
  const modalRef = useRef(null);

  const finishOnboarding = useCallback(() => {
    localStorage.setItem("onboardingComplete", "true");
    onClose?.();
  }, [onClose]);

  useEffect(() => { modalRef.current?.focus(); }, []);

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
    if (step + 1 < STEPS.length) fetch(`/assets/onboarding/${STEPS[step + 1].filename}`);
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
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        {...swipeHandlers}
>>>>>>> Stashed changes
      >
        <motion.div
          ref={modalRef}
          role="dialog"
<<<<<<< Updated upstream
          tabIndex={-1}
          aria-labelledby="onboarding-title"
          aria-describedby="onboarding-desc"
          className="relative w-full max-w-lg bg-zinc-900/90 text-white rounded-2xl shadow-xl border border-zinc-700 overflow-hidden"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <button onClick={finishOnboarding} className="absolute top-3 right-3 text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>

          <div className="px-6 pt-5 flex items-center justify-between">
            <span className="text-xs text-zinc-400">{Math.min(step + 1, totalSteps)}/{totalSteps}</span>
            <div className="flex-1 mx-3 h-1 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div className="h-full bg-teal-400" style={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          <motion.div
            key={step}
            className="px-6 py-6 flex flex-col items-center text-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
          >
            <div className="w-full h-60 bg-zinc-800 rounded-xl mb-5 flex items-center justify-center">
              {animData ? (
                <Lottie animationData={animData} loop autoplay style={{ width: '100%', height: '100%' }} />
              ) : (
                <div className="animate-pulse h-10 w-10 bg-zinc-700 rounded-full" />
              )}
            </div>
            <h2 id="onboarding-title" className="text-2xl font-bold mb-2">{current.title || ''}</h2>
            <p id="onboarding-desc" className="text-sm text-zinc-300 min-h-[3.5rem] leading-relaxed">{typedDesc}</p>
          </motion.div>

          <div className="flex items-center justify-between px-6 pb-5">
            <button onClick={prev} disabled={step === 0} className="text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-40">← Back</button>
            <div className="flex space-x-2">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === step ? 'bg-teal-400' : 'bg-zinc-700'}`} />
              ))}
            </div>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="text-sm text-teal-300 hover:text-teal-100">Next →</button>
            ) : (
              <button onClick={finishOnboarding} className="text-sm text-teal-300 hover:text-teal-100">Finish</button>
            )}
          </div>

          {current.id === 'audio' && (
            <div className="px-6 pb-6">
              <button onClick={() => { enableSound(); next(); }} className="w-full py-2 font-semibold rounded-full bg-teal-500 hover:bg-teal-400">Enable Audio</button>
=======
          aria-modal="true"
          aria-labelledby="onboarding-title"
          aria-describedby="onboarding-desc"
          tabIndex={-1}
          className="relative w-full max-w-md bg-zinc-900/80 text-white rounded-2xl shadow-2xl overflow-hidden outline-none border border-zinc-700 backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <button
            onClick={finishOnboarding}
            aria-label="Close onboarding"
            className="absolute top-3 right-3 text-teal-400 hover:text-teal-200 transition-colors"
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
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="px-6 py-5 flex flex-col items-center text-center"
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
              className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            {step < STEPS.length - 1 && (
              <button
                onClick={next}
                className="flex items-center gap-1 text-xs text-teal-300 hover:text-teal-100 transition"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {currentStep.id === "audio" && (
            <div className="px-6 pb-4 text-center">
              <button
                onClick={() => {
                  try {
                    enableSound(); // ✅ call actual context function
                  } catch (err) {
                    console.warn("Audio enable error:", err);
                  }
                  setTimeout(() => {
                    if (step < STEPS.length - 1) {
                      setStep(step + 1);
                    } else {
                      finishOnboarding();
                    }
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
                className="text-xs text-teal-300 hover:underline"
              >
                Finish and do not ask again
              </button>
>>>>>>> Stashed changes
            </div>
          )}
        </motion.div>
      </motion.div>
<<<<<<< Updated upstream
    </AnimatePresence>,
    document.body
  );
}

=======
    </AnimatePresence>
  );
}


>>>>>>> Stashed changes
