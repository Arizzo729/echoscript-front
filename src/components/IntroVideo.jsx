// src/components/IntroVideo.jsx
import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
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

  // Reveal skip button after skipAfter seconds
  useEffect(() => {
    if (skipAfter > 0) {
      const timer = setTimeout(() => setCanSkip(true), skipAfter * 1000);
      return () => clearTimeout(timer);
    }
  }, [skipAfter]);

  // Handle both end and skip
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <video
            className="w-full h-full object-cover"
            src={src}
            autoPlay
            onEnded={finish}
          />

          {canSkip && (
            <motion.div
              className="absolute bottom-6 right-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button variant="outline" size="sm" onClick={finish}>
                {skipLabel}
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
