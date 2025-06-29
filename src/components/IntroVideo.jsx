// src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * IntroVideo component — guaranteed fullscreen intro playback with audio fade-in.
 * Shows a spinner until video is ready, falls back on error.
 *
 * Props:
 * - sources: Array<{ src: string; type: string }> — list of sources (highest-res first)
 * - onFinish?: () => void — callback after video ends or is skipped
 * - skipLabel?: string — skip button text
 * - skipAfter?: number — seconds before skip button appears
 */
export default function IntroVideo({ sources = [], onFinish, skipLabel = 'Skip Intro', skipAfter = 0 }) {
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [canSkip, setCanSkip] = useState(skipAfter === 0);
  const videoRef = useRef(null);

  // Show skip after delay
  useEffect(() => {
    if (skipAfter > 0) {
      const timer = setTimeout(() => setCanSkip(true), skipAfter * 1000);
      return () => clearTimeout(timer);
    }
  }, [skipAfter]);

  // Video event handlers
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !sources.length) return;

    const handleReady = () => {
      setLoading(false);
      vid.play().catch(console.warn);
      // Fade audio
      vid.muted = true;
      vid.volume = 0;
      const targetVol = 0.4;
      const stepCount = 20;
      const stepVol = targetVol / stepCount;
      let currentVol = 0;
      const ramp = setInterval(() => {
        currentVol = Math.min(currentVol + stepVol, targetVol);
        vid.volume = currentVol;
        if (currentVol >= targetVol) {
          vid.muted = false;
          clearInterval(ramp);
        }
      }, 50);
    };

    const handleError = () => {
      console.error('IntroVideo error, skipping');
      finish();
    };

    vid.preload = 'auto';
    vid.playsInline = true;
    vid.muted = true;
    vid.addEventListener('canplaythrough', handleReady);
    vid.addEventListener('error', handleError);
    return () => {
      vid.removeEventListener('canplaythrough', handleReady);
      vid.removeEventListener('error', handleError);
    };
  }, [sources]);

  const finish = () => {
    setVisible(false);
    onFinish?.();
  };

  // Block scroll
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  if (!sources.length) {
    console.error('IntroVideo: no sources provided');
    // Skip immediately
    finish();
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed inset-0 z-[9999] bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="animate-spin border-4 border-teal-400 border-t-transparent rounded-full h-12 w-12" />
              </div>
            )}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover object-top"
              onEnded={finish}
            >
              {sources.map(({ src, type }) => (
                <source key={src} src={src} type={type} />
              ))}
            </video>
          </div>
          {canSkip && !loading && (
            <motion.button
              onClick={finish}
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2 rounded"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
              {skipLabel}
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

