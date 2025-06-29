import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * IntroVideo — Professional, auto-start fullscreen intro using native <video>.
 * Automatically plays on mount (muted for autoplay compliance), handles loading state,
 * multiple <source> fallbacks, errors, and a themed skip button.
 * 
 * Props:
 * - sources: Array<{ src: string; type: string }> (highest priority first)
 * - poster?: string — preview image (optional)
 * - skipAfter?: number — seconds until skip button appears (default: 3)
 * - skipLabel?: string — text for skip button (default: 'Skip Intro')
 * - onFinish?: () => void — callback when video ends or skip is pressed
 */
export default function IntroVideo({
  sources = [],
  poster,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
  onFinish,
}) {
  const [canSkip, setCanSkip] = useState(false);
  const [loading, setLoading] = useState(true);

  // Enable skip button after delay
  useEffect(() => {
    const timer = setTimeout(() => setCanSkip(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [skipAfter]);

  const handleLoaded = () => setLoading(false);
  const handleError = (e) => {
    console.warn('IntroVideo load error:', e);
    onFinish?.();
  };
  const handleFinish = () => onFinish?.();

  return (
    <AnimatePresence>
      <motion.div
        key="intro-video"
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin border-4 border-teal-500 border-t-transparent rounded-full h-12 w-12" />
          </div>
        )}

        {/* Fullscreen video */}
        <video
          className="w-full h-full object-contain bg-black"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={poster}
          onEnded={handleFinish}
          onError={handleError}
          onLoadedData={handleLoaded}
        >
          {sources.map(({ src, type }, idx) => (
            <source key={idx} src={src} type={type} />
          ))}
          <p className="text-white">Your browser does not support embedded videos.</p>
        </video>

        {/* Themed skip button */}
        {canSkip && (
          <button
            onClick={handleFinish}
            className="absolute bottom-6 right-6 bg-teal-500/40 hover:bg-teal-500/60 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg transition"
          >
            {skipLabel}
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}


