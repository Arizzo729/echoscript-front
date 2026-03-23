import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import IntroVideo from './IntroVideo';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { X } from 'lucide-react';
import { useSound } from '../context/SoundContext';

import heroGuide from '../assets/onboarding/hero-guide.png';
import logoGlow from '../assets/onboarding/logo-glow.png';
import logoLight from '../assets/onboarding/logo-light.png';
import echoEcosystem from '../assets/onboarding/echo-ecosystem.png';
import portalBrand from '../assets/onboarding/portal-brand.png';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to EchoScript.AI',
    description:
      'Turn audio and video into clean, editable text in seconds. Use EchoScript for transcription, translation, subtitles, and faster content workflows.',
    image: heroGuide,
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
    image: logoGlow,
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
    image: logoLight,
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
    image: echoEcosystem,
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
    image: portalBrand,
    tips: [
      'Fast workflows',
      'AI-powered productivity',
      'Built for creators & builders'
    ]
  }
];

export default function OnboardingModal({ onClose }) {
  const { playClick } = useSound();
  const shouldReduce = useReducedMotion();
  const [showVideo, setShowVideo] = useState(true);
  const [step, setStep] = useState(0);
  const [typedDesc, setTypedDesc] = useState('');
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
    setImgError(false);
  }, [step]);

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
          aria-labelledby="onboarding-title"
          aria-describedby="onboarding-desc"
          className="relative w-full max-w-3xl bg-zinc-900/95 text-white rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden"
          initial={{ y: shouldReduce ? 0 : 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: shouldReduce ? 0 : -40, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={finishOnboarding}
            className="absolute top-3 right-3 text-zinc-400 hover:text-white transition"
            aria-label="Close onboarding"
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
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <motion.div
            key={step}
            className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-full h-[300px] bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 flex items-center justify-center">
              {current.image && !imgError ? (
                <img
                  src={current.image}
                  alt={current.title || 'Onboarding visual'}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-6">
                  <div className="animate-pulse h-12 w-12 bg-zinc-700 rounded-full mb-4" />
                  <p className="text-sm text-zinc-400">
                    Image failed to load for this slide.
                  </p>
                </div>
              )}
            </div>

            <div>
              <h2 id="onboarding-title" className="text-3xl font-bold mb-3">
                {current.title}
              </h2>

              <p
                id="onboarding-desc"
                className="text-zinc-300 mb-4 min-h-[80px] leading-relaxed"
              >
                {typedDesc}
              </p>

              <div className="space-y-2">
                {current.tips?.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-800/70 px-3 py-2"
                  >
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-1.5 shrink-0" />
                    <p className="text-sm text-zinc-200">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between px-6 pb-5">
            <button
              onClick={prev}
              disabled={step === 0}
              className="text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-40 transition"
            >
              ← Back
            </button>

            <div className="flex space-x-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition ${
                    i === step ? 'bg-teal-400' : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>

            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="text-sm text-teal-300 hover:text-teal-100 transition"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={finishOnboarding}
                className="text-sm text-teal-300 hover:text-teal-100 transition"
              >
                Finish
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
