// src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * IntroVideo component — plays a fullscreen intro clip on login with audio fade-in
 *
 * Props:
 * - sources?: Array<{ src: string, type: string }> — list of video sources for resolution fallback
 * - src?: string — single video URL fallback
 * - type?: string — MIME type when using single src (default 'video/mp4')
 * - onFinish?: () => void — callback when video ends or is skipped
 * - skipLabel?: string — text for the skip button (default: 'Skip Intro')
 * - skipAfter?: number — seconds before the skip button appears (default: 0)
 */
export default function IntroVideo({ sources, src, type = 'video/mp4', onFinish, skipLabel = 'Skip Intro', skipAfter = 0 }) {
  const [visible, setVisible] = useState(true);
  const [canSkip, setCanSkip] = useState(skipAfter === 0);
  const videoRef = useRef(null);

  // Determine sources array
  const videoSources = Array.isArray(sources)
    ? sources
    : src
    ? [{ src, type }]
    : [];

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || videoSources.length === 0) return;

    vid.muted = true;
    vid.volume = 0;
    vid.preload = 'auto';

    const handleCanPlay = () => {
      vid.play().catch(err => console.warn('IntroVideo play failed:', err));
      const targetVol = 0.4;
      const duration = 1000;
      const interval = 50;
      const step = targetVol / (duration / interval);
      let vol = 0;
      const ramp = setInterval(() => {
        vol = Math.min(vol + step, targetVol);
        vid.volume = vol;
        if (vol >= targetVol) {
          vid.muted = false;
          clearInterval(ramp);
        }
      }, interval);
    };

    vid.addEventListener('canplaythrough', handleCanPlay);
    return () => vid.removeEventListener('canplaythrough', handleCanPlay);
  }, [videoSources]);

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
          className="fixed inset-0 z-[9999] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              controls={false}
              onEnded={finish}
              className="absolute top-0 left-0 w-full h-full object-cover object-top"
            >
              {videoSources.map(({ src, type }) => (
                <source key={src} src={src} type={type} />
              ))}
              Your browser does not support the video tag.
            </video>
          </div>

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

