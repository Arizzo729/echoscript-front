import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import IntroVideo from './IntroVideo';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import Lottie from 'lottie-react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useSound } from '../context/SoundContext';

const STEPS = [
  {
    id: 'upload',
    title: 'Welcome to EchoScript.AI',
    description: 'Upload or record audio—Echo gives you perfect transcripts in seconds.',
    filename: 'upload.json',
  },
  {
    id: 'cleanup',
    title: 'Smart Cleanup',
    description: 'Remove filler words, summarize, detect tone, and organize your content.',
    filename: 'cleanup.json',
  },
  {
    id: 'global',
    title: 'Global Support',
    description: 'Echo understands all voices—English, Spanish, Arabic, and more.',
    filename: 'global.json',
  },
  {
    id: 'security',
    title: 'Privacy First',
    description: 'End-to-end encryption, CAPTCHA, and 2FA—your data stays yours.',
    filename: 'security.json',
  },
  {
    id: 'integrations',
    title: 'Seamless Uploads',
    description: "Use drag-and-drop, Google Drive, or Dropbox—it's all built in.",
    filename: 'integrations.json',
  },
  {
    id: 'audio',
    title: 'Enable Audio',
    description: 'Turn on microphone support for live recording and voice features.',
    filename: 'audio.json',
  },
  {
    id: 'start',
    title: "Let's Transcribe",
    description: "You're ready. Pick a plan and explore EchoScript.AI.",
    filename: 'start.json',
  },
];

export default function OnboardingModal({ onClose }) {
  const { enableSound } = useSound();
  const shouldReduceMotion = useReducedMotion();
  const [showVideo, setShowVideo] = useState(true);
  const [step, setStep] = useState(0);
  const [typedDesc, setTypedDesc] = useState('');
  const [animData, setAnimData] = useState(null);
  const modalRef = useRef(null);
  const abortCtrl = useRef(null);

  // Handlers
  const handleVideoFinish = useCallback(() => setShowVideo(false), []);
  const finishOnboarding = useCallback(() => {
    localStorage.setItem('onboardingComplete', 'true');
    onClose();
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    const node = modalRef.current;
    node?.focus();
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
      if (e.key === 'Escape') finishOnboarding();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finishOnboarding]);

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Load Lottie
  useEffect(() => {
    abortCtrl.current?.abort();
    const ctrl = new AbortController();
    abortCtrl.current = ctrl;
    setAnimData(null);
    fetch(`/assets/onboarding/${STEPS[step].filename}`, { signal: ctrl.signal })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then(setAnimData)
      .catch(() => {});
    if (step + 1 < STEPS.length) {
      fetch(`/assets/onboarding/${STEPS[step + 1].filename}`);
    }
    return () => ctrl.abort();
  }, [step]);

  // Typewriter effect
  useEffect(() => {
    const text = STEPS[step].description;
    let idx = 0;
    setTypedDesc('');
    const speed = 30;
    const timer = setInterval(() => {
      idx++;
      setTypedDesc(text.slice(0, idx));
      if (idx >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [step]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextStep,
    onSwipedRight: prevStep,
    trackMouse: true,
  });

  // Progress
  const progress = ((step + 1) / STEPS.length) * 100;
  const current = STEPS[step];

  // Render
  return ReactDOM.createPortal(
    showVideo ? (
      <IntroVideo
        sources={[
          { src: defaultSources[0].src, type: defaultSources[0].type },
          { src: defaultSources[1].src, type: defaultSources[1].type }
        ]}
        onFinish={handleVideoFinish}
        skipAfter={3}
        skipLabel="Skip Intro"
      />
    ) : (
      <AnimatePresence>
        <motion.div
          {...swipeHandlers}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            className="relative w-full max-w-md bg-zinc-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-700 backdrop-blur-sm"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            {/* Close */}
            <button
              onClick={finishOnboarding}
              aria-label="Close onboarding"
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Progress */}
            <div className="px-6 pt-6 flex items-center">
              <span className="text-xs text-zinc-400">Step {step+1} of {STEPS.length}</span>
              <div className="flex-1 h-1 bg-zinc-700 mx-4 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 transition-width duration-300" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-zinc-400">{current.title}</span>
            </div>

            {/* Content */}
            <div className="px-6 py-4 text-center">
              <div className="h-48 mb-4">
                {animData ? (
                  <Lottie animationData={animData} loop autoplay />
                ) : (
                  <div className="animate-spin w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full mx-auto" />
                )}
              </div>
              <h2 id="onboarding-title" className="text-2xl font-semibold mb-2">{current.title}</h2>
              <p className="text-zinc-400 mb-6 min-h-[3rem]">{typedDesc}</p>

              {/* Conditional CTA */}
              {current.id === 'audio' ? (
                <button
                  onClick={() => { enableSound(); nextStep(); }}
                  className="w-full py-2 bg-teal-500 hover:bg-teal-400 rounded-full font-semibold transition"
                >Enable Audio</button>
              ) : null}

              {current.id === 'start' && (
                <>
                  <button
                    onClick={finishOnboarding}
                    className="w-full py-2 bg-teal-500 hover:bg-teal-400 rounded-full font-semibold transition mb-2"
                  >Finish</button>
                  <button
                    onClick={finishOnboarding}
                    className="text-xs text-teal-300 hover:underline"
                  >Do not ask again</button>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 flex justify-between">
              <button
                onClick={prevStep}
                disabled={step===0}
                className="text-sm text-zinc-400 hover:text-white disabled:opacity-40 flex items-center"
              ><ArrowLeft className="mr-1" /> Back</button>
              {step < STEPS.length-1 && (
                <button
                  onClick={nextStep}
                  className="text-sm text-teal-300 hover:text-teal-100 flex items-center"
                >Next <ArrowRight className="ml-1" /></button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  , document.body);
} 

