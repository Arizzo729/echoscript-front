import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import IntroVideo from './IntroVideo';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import Lottie from 'lottie-react';
import { X } from 'lucide-react';
import { useSound } from '../context/SoundContext';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to EchoScript.AI',
    description:
      'Turn audio and video into clean, editable text in seconds. Use EchoScript for transcription, translation, subtitles, and faster content workflows.',
    image: '/assets/onboarding/hero-guide.png',
    tips: [
      'Upload audio or video to start quickly',
      'Use clear recordings for the best transcript quality',
      'Review and edit transcripts before exporting'
    ]
  },
  {
    id: 'core-tools',
    title: 'Your Main Tools',
    description:
      'EchoScript helps you go from raw media to usable content fast — transcription, translation, subtitles, all in one place.',
    image: '/assets/onboarding/logo-glow.png',
    tips: [
      'Transcription: convert speech into text',
      'Translation: expand to global audiences',
      'Subtitles: boost engagement + accessibility'
    ]
  },
  {
    id: 'best-results',
    title: 'Get the Best Results',
    description:
      'Better input = better output. Clean audio means higher accuracy, fewer edits, and better subtitle timing.',
    image: '/assets/onboarding/logo-light.png',
    tips: [
      'Reduce background noise',
      'Use a clear speaker or good mic',
      'Split long recordings for better results'
    ]
  },
  {
    id: 'ecosystem',
    title: 'More Than One App',
    description:
      'EchoScript is part of a growing AI ecosystem focused on productivity, connection, and real-world utility.',
    image: '/assets/onboarding/echo-ecosystem.png',
    tips: [
      'EchoScript: transcription & media tools',
      'EchoUnite: community + connection',
      'EchoLock: utility + safety tools'
    ]
  },
  {
    id: 'vision',
    title: 'Step Into the Future',
    description:
      'You’re not just using a tool — you’re entering a new way to work with content, powered by AI.',
    image: '/assets/onboarding/portal-brand.png',
    tips: [
      'Fast workflows',
      'AI-powered productivity',
      'Built for creators & builders'
    ]
  },
  {
    id: 'audio',
    title: 'Enable Audio Experience',
    description:
      'Turn on sound for a more immersive experience throughout the platform.',
    image: '/assets/onboarding/logo-glow.png',
    tips: [
      'Optional but recommended',
      'Can be changed later',
      'Best with headphones or speakers'
    ]
  }
];

export default function OnboardingModal({ onClose }) {
  const { playClick, enableSound } = useSound();
  const shouldReduce = useReducedMotion();
  const [showVideo, setShowVideo] = useState(true);
  const [step, setStep] = useState(0);
  const [typedDesc, setTypedDesc] = useState('');
  const [animData, setAnimData] = useState(null);
  const [imgError, setImgError] = useState(false);
  const modalRef = useRef(null);

  const handleVideoFinish = useCallback(() => setShowVideo(false), []);
  const finishOnboarding = useCallback(() => {
    localStorage.setItem('onboardingComplete', 'true');
    onClose?.();
  }, [onClose]);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      playClick?.();
    }
  }, [playClick, step]);

  const prev = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
      playClick?.();
    }
  }, [playClick, step]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') finishOnboarding();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [finishOnboarding, next, prev]);

  useEffect(() => {
    let cancel = false;
    setAnimData(null);
    setImgError(false);

    const currentStep = STEPS?.[step];
    if (!currentStep || !currentStep.filename) return;

    const controller = new AbortController();

    fetch(`/assets/onboarding/${currentStep.filename}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (!cancel) setAnimData(data);
      })
      .catch(() => {});

    return () => {
      cancel = true;
      controller.abort();
    };
  }, [step]);

  useEffect(() => {
    const current = STEPS?.[step];
    const full = current?.description || '';
    let idx = 0;
    setTypedDesc('');

    const timer = setInterval(() => {
      idx += 1;
      setTypedDesc(full.slice(0, idx));
      if (idx >= full.length) clearInterval(timer);
    }, 18);

    return () => clearInterval(timer);
  }, [step]);

  const swipe = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true
  });

  const progress = ((step + 1) / STEPS.length) * 100;
  const current = STEPS?.[step] || {};

  if (showVideo) {
    return <IntroVideo onFinish={handleVideoFinish} skipAfter={3} skipLabel="Skip Intro" />;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        {...swipe}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          tabIndex={-1}
          className="relative w-full max-w-3xl bg-zinc-900/95 text-white rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden"
          initial={{ y: shouldReduce ? 0 : 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: shouldReduce ? 0 : -40, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={finishOnboarding}
            className="absolute top-3 right-3 text-zinc-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="px-6 pt-5 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {step + 1}/{STEPS.length}
            </span>
            <div className="flex-1 mx-3 h-1 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal-400"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <motion.div
            key={step}
            className="px-6 py-6 grid md:grid-cols-2 gap-6 items-center"
          >
            <div className="w-full h-[300px] bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700">
              {current.image && (
                <img
                  src={current.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-3">
                {current.title}
              </h2>

              <p className="text-zinc-300 mb-4 min-h-[80px]">
                {typedDesc}
              </p>

              <div className="space-y-2">
                {current.tips?.map((tip, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-1" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between px-6 pb-5">
            <button onClick={prev} disabled={step === 0}>
              ← Back
            </button>

            {step < STEPS.length - 1 ? (
              <button onClick={next}>Next →</button>
            ) : (
              <button onClick={finishOnboarding}>Finish</button>
            )}
          </div>

          {current.id === 'audio' && (
            <div className="px-6 pb-6">
              <button
                onClick={() => {
                  enableSound?.();
                  next();
                }}
                className="w-full py-3 bg-teal-500 text-black rounded-full"
              >
                Enable Audio
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
