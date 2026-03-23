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
      'EchoScript is built to help you move from raw media to useful content fast. Start with transcription, then translate, generate subtitles, and repurpose the final text wherever you need it.',
    image: '/assets/onboarding/portal-brand.png',
    tips: [
      'Transcription: convert speech into text',
      'Translation: make content usable across languages',
      'Subtitles: improve accessibility and video engagement'
    ]
  },
  {
    id: 'best-results',
    title: 'How to Get the Best Results',
    description:
      'Great input gives great output. Cleaner audio means more accurate transcripts, fewer edits, and better subtitle timing.',
    image: '/assets/onboarding/logo-light.png',
    tips: [
      'Reduce background noise when possible',
      'Use one clear speaker or high-quality mic audio',
      'Break long recordings into smaller files if needed'
    ]
  },
  {
    id: 'ecosystem',
    title: 'More Than One App',
    description:
      'EchoScript is part of the wider Echo ecosystem. The company is expanding into AI tools built around productivity, connection, communication, and real-world utility.',
    image: '/assets/onboarding/echo-ecosystem.png',
    tips: [
      'EchoScript: AI transcription and media tools',
      'EchoUnite: community and connection',
      'EchoLock: utility-focused companion experience'
    ]
  },
  {
    id: 'audio',
    title: 'Enable Audio Experience',
    description:
      'Turn on sound for a more immersive experience throughout the platform. This helps with ambient effects, interactions, and a more polished first impression.',
    image: '/assets/onboarding/hero-guide.png',
    tips: [
      'Optional, but recommended',
      'You can change this later in settings',
      'Best experienced with speakers or headphones'
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

    const speed = 24;
    const timer = setInterval(() => {
      idx += 1;
      setTypedDesc(full.slice(0, idx));
      if (idx >= full.length) clearInterval(timer);
    }, speed);

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
          initial={{ y: shouldReduce ? 0 : 40, opacity: 0, scale: shouldReduce ? 1 : 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: shouldReduce ? 0 : -40, opacity: 0, scale: shouldReduce ? 1 : 0.98 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/8 via-transparent to-blue-500/8 pointer-events-none" />

          <button
            onClick={finishOnboarding}
            className="absolute top-3 right-3 z-20 text-zinc-400 hover:text-white transition"
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
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-[260px] sm:h-[320px] bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 flex items-center justify-center">
              {animData ? (
                <Lottie animationData={animData} loop autoplay style={{ width: '100%', height: '100%' }} />
              ) : current.image && !imgError ? (
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
                    Add your image to the /public/assets/onboarding folder to show this slide visual.
                  </p>
                </div>
              )}
            </div>

            <div className="text-left">
              <h2 id="onboarding-title" className="text-2xl sm:text-3xl font-bold mb-3">
                {current.title || ''}
              </h2>

              <p
                id="onboarding-desc"
                className="text-sm sm:text-base text-zinc-300 leading-relaxed min-h-[88px]"
              >
                {typedDesc}
              </p>

              {Array.isArray(current.tips) && current.tips.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-teal-300 mb-3">
                    Quick Tips
                  </p>
                  <div className="space-y-2">
                    {current.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-800/70 px-3 py-2"
                      >
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-400 shrink-0" />
                        <p className="text-sm text-zinc-200">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

          {current.id === 'audio' && (
            <div className="px-6 pb-6">
              <button
                onClick={() => {
                  enableSound?.();
                  next();
                }}
                className="w-full py-3 font-semibold rounded-full bg-teal-500 hover:bg-teal-400 text-zinc-950 transition"
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
