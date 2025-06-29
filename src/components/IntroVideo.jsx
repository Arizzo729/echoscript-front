// src/components/IntroVideo.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * IntroVideo component — plays a fullscreen intro clip on login
 *
 * Props:
 * - src: string — URL/path to the video file (e.g., '/videos/intro.mp4')
 * - onFinish?: () => void — callback when video ends or is skipped
 * - skipLabel?: string — text for the skip button (default: 'Skip Intro')
 * - skipAfter?: number — seconds before the skip button appears (default: 0)
 */
export default function IntroVideo({ src, onFinish, skipLabel = 'Skip Intro', skipAfter = 0 }) {
  const [visible, setVisible] = useState(true);
  const [canSkip, setCanSkip] = useState(skipAfter === 0);

  // Reveal skip button after delay
  useEffect(() => {
    if (skipAfter > 0) {
      const timer = setTimeout(() => setCanSkip(true), skipAfter * 1000);
      return () => clearTimeout(timer);
    }
  }, [skipAfter]);

  const finish = () => {
    setVisible(false);
    onFinish?.();
  };

  // Prevent background scroll while visible
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-video"
          className="fixed inset-0 z-[9999] overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={src}
            autoPlay
            muted
            playsInline
            controls={false}
            onEnded={finish}
          />

          {canSkip && (
            <motion.button
              onClick={finish}
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {skipLabel}
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

