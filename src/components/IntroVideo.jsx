// File: src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18n for react components
i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: {} } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


// File: src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, X } from 'lucide-react';

/**
 * IntroVideo — High-quality, cross-browser intro video with seamless transition.
 * Features:
 *  - Multiple resolution fallbacks (1440p, 720p, 480p)
 *  - Muted autoplay with playsInline for mobile
 *  - Skip & Unmute controls appearing after delay
 *  - Fade-out transition to main content
 *  - Prefers-reduced-motion support
 */
const defaultSources = [
  { src: '/videos/intro-1440p.mp4', type: 'video/mp4', resolution: 1440 },
  { src: '/videos/intro-720p.mp4',  type: 'video/mp4', resolution:  720 },
  { src: '/videos/intro-480p.mp4',  type: 'video/mp4', resolution:  480 }
];

export default function IntroVideo({
  sources = defaultSources,
  poster,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
  onFinish
}) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  // Detect reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sort sources by resolution
  const sorted = [...sources]
    .sort((a, b) => b.resolution - a.resolution);

  // Autoplay muted on mount
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip intro if user prefers reduced motion
      finishIntro();
    } else {
      const vid = videoRef.current;
      if (vid) {
        vid.muted = true;
        vid.playsInline = true;
        const promise = vid.play();
        if (promise?.catch) promise.catch(() => {});
      }
      // Show controls after skipAfter seconds
      const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
      return () => clearTimeout(timer);
    }
  }, [skipAfter, prefersReducedMotion]);

  // When video loads, hide spinner
  const handleLoaded = () => setLoading(false);

  // Fade out overlay and call onFinish
  const finishIntro = () => {
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.classList.add('opacity-0');
      overlay.addEventListener('transitionend', () => onFinish?.(), { once: true });
    } else {
      onFinish?.();
    }
  };

  // Skip button handler
  const handleSkip = () => {
    videoRef.current?.pause();
    finishIntro();
  };

  // Unmute handler
  const handleUnmute = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      vid.volume = 1;
    }
  };

  return (
    <AnimatePresence>
      {!prefersReducedMotion && (
        <motion.div
          ref={overlayRef}
          key="intro-overlay"
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-700"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Loading Spinner */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin border-4 border-teal-500 border-t-transparent rounded-full h-12 w-12" />
            </div>
          )}

          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover bg-black"
            autoplay
            muted
            playsInline
            preload="auto"
            poster={poster}
            onLoadedData={handleLoaded}
            onEnded={finishIntro}
            onError={finishIntro}
            controls={false}
            disablePictureInPicture
          >
            {sorted.map((s, i) => (
              <source key={i} src={s.src} type={s.type} />
            ))}
            <p className="text-white">Your browser does not support embedded videos.</p>
          </video>

          {/* Controls */}
          {controlsVisible && (
            <div className="absolute bottom-6 right-6 flex space-x-3">
              <button
                onClick={handleSkip}
                className="bg-teal-500/60 hover:bg-teal-500/80 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg transition"
              >
                {skipLabel}
              </button>
              <button
                onClick={handleUnmute}
                className="bg-white/20 hover:bg-white/40 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg transition flex items-center space-x-1"
              >
                <Volume2 size={16} />
                <span>Unmute</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}