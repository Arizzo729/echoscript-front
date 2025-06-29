// src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * IntroVideo component — plays a fullscreen intro clip on login with guaranteed playback
 * and smooth audio fade-in. Autoplay policy compliance via muted start.
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

  // Build sources array
  const videoSources = Array.isArray(sources) ? sources : src ? [{ src, type }] : [];

  // Autoplay on loaded data and fade-in audio
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || videoSources.length === 0) return;
    vid.preload = 'auto';
    vid.playsInline = true;
    vid.muted = true;
    vid.volume = 0;

    const handleLoadedData = async () => {
      try {
        await vid.play();
      } catch (err) {
        console.warn('IntroVideo play failed:', err);
      }
      // fade volume to 40%
      const targetVol = 0.4;
      const duration = 1000;
      const steps = duration / 50;
      const stepVol = targetVol / steps;
      let vol = 0;
      const ramp = setInterval(() => {
        vol = Math.min(vol + stepVol, targetVol);
        vid.volume = vol;
        if (vol >= targetVol) {
          vid.muted = false;
          clearInterval(ramp);
        }
      }, 50);
    };

    vid.addEventListener('loadeddata', handleLoadedData);
    return () => vid.removeEventListener('loadeddata', handleLoadedData);
  }, [videoSources]);

  // Reveal skip button after delay
  useEffect(() => {
    if (skipAfter > 0) {
      const timer = setTimeout(() => setCanSkip(true), skipAfter * 1000);
      return () => clearTimeout(timer);
    }
  }, [skipAfter]);

  // Finish handler
  const finish = () => {
    setVisible(false);
    onFinish && onFinish();
  };

  // Prevent background scroll
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
              autoPlay
              muted
              playsInline
              controls={false}
              onEnded={finish}
              className="absolute inset-0 w-full h-full object-cover object-top"
            >
              {videoSources.map(({ src: s, type: t }) => (
                <source key={s} src={s} type={t} />
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


