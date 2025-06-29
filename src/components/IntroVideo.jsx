import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X } from 'lucide-react';

/**
 * IntroVideo — Professional, reliable intro using native <video> and Play/Skip UI.
 * Implements multiple <source> tags per MDN recommendations, handles loading state,
 * fallback source order, error recovery, and skip functionality.
 * Inspired by best practices on MDN (Video element) and CSS-Tricks (Full-screen media).
 *
 * Props:
 * - sources: Array<{ src: string; type: string }> (highest priority first)
 * - poster?: string — fallback image before video loads
 * - skipAfter?: number — seconds until skip button shows (default: 3)
 * - skipLabel?: string — text for skip button (default: 'Skip Intro')
 * - onFinish?: () => void — callback when video ends or is skipped
 */
export default function IntroVideo({
  sources = [],
  poster,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
  onFinish,
}) {
  const [playing, setPlaying] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show skip after delay
  useEffect(() => {
    let timer;
    if (playing) {
      setLoading(true);
      timer = setTimeout(() => setCanSkip(true), skipAfter * 1000);
    }
    return () => clearTimeout(timer);
  }, [playing, skipAfter]);

  const handleStart = () => {
    if (sources.length) setPlaying(true);
  };

  const handleFinish = () => {
    setPlaying(false);
    setCanSkip(false);
    onFinish?.();
  };

  const handleError = (e) => {
    console.warn('IntroVideo load error:', e);
    handleFinish();
  };

  const handleLoaded = () => setLoading(false);

  return (
    <AnimatePresence>
      {!playing && (
        <motion.div
          key="poster"
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button onClick={handleStart} className="flex flex-col items-center focus:outline-none">
            <Play size={72} className="text-white animate-pulse" />
            <span className="text-white mt-2">Click to start intro</span>
          </button>
        </motion.div>
      )}

      {playing && (
        <motion.div
          key="video"
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin border-4 border-teal-400 border-t-transparent rounded-full h-12 w-12" />
            </div>
          )}

          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={poster}
            onEnded={handleFinish}
            onError={handleError}
            onLoadedData={handleLoaded}
          >
            {sources.map(({ src, type }, i) => (
              <source key={i} src={src} type={type} />
            ))}
            <p className="text-white">Your browser does not support embedded videos.</p>
          </video>

          {canSkip && (
            <button
              onClick={handleFinish}
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2 rounded flex items-center space-x-1 focus:outline-none"
            >
              <X size={12} />
              <span>{skipLabel}</span>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

