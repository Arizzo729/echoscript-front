// src/components/IntroVideo.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player/lazy';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

/**
 * IntroVideo component — rock-solid fullscreen intro using react-player.
 * Guarantees playback via user click, supports resolution fallback,
 * shows loading indicator, handles errors, and provides a skip button.
 *
 * Props:
 * - sources: string[] — list of video URLs (highest-res first)
 * - onFinish?: () => void — callback when video ends or skip is pressed
 * - skipAfter?: number — seconds before skip button appears (default: 3)
 * - skipLabel?: string — text for the skip button (default: 'Skip Intro')
 */
export default function IntroVideo({
  sources = [],
  onFinish,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
}) {
  const [playing, setPlaying] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Reveal skip after delay
  useEffect(() => {
    const t = setTimeout(() => setCanSkip(true), skipAfter * 1000);
    return () => clearTimeout(t);
  }, [skipAfter]);

  // Start playback after user click
  const handleStart = useCallback(() => {
    if (!sources.length) return;
    setLoading(true);
    setPlaying(true);
  }, [sources]);

  // Called when video ends or skip pressed
  const finish = useCallback(() => {
    setPlaying(false);
    onFinish?.();
  }, [onFinish]);

  // Loading and error states
  const handleReady = () => setLoading(false);
  const handleError = () => {
    setError(true);
    finish();
  };

  return (
    <AnimatePresence>
      {!playing && !error && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStart}>
            <Play size={72} className="text-white animate-pulse" />
            <span className="text-white mt-2">Click to start intro</span>
          </div>
        </motion.div>
      )}

      {playing && !error && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <ReactPlayer
            url={sources}
            playing={playing}
            width="100%"
            height="100%"
            volume={0.4}
            onReady={handleReady}
            onError={handleError}
            onEnded={finish}
            config={{
              file: {
                attributes: {
                  preload: 'auto',
                  playsInline: true,
                  controls: false,
                },
              },
            }}
          />

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin border-4 border-teal-400 border-t-transparent rounded-full h-12 w-12" />
            </div>
          )}

          {canSkip && !loading && (
            <button
              onClick={finish}
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2 rounded"
            >
              {skipLabel}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
