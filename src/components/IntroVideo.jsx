// src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Settings, X } from 'lucide-react';

/**
 * IntroVideo component — advanced fullscreen intro with resolution fallback,
 * buffering indicator, audio fade-in, and error recovery.
 * Requires user interaction to guarantee playback.
 *
 * Props:
 * - sources: Array<{ src: string; type: string; label?: string }> — video URLs ordered high→low, optional labels
 * - onFinish?: () => void — callback when video ends or is skipped
 * - skipLabel?: string — skip button text
 * - skipAfter?: number — seconds before skip button appears
 */
export default function IntroVideo({
  sources = [],
  onFinish,
  skipLabel = 'Skip Intro',
  skipAfter = 0,
}) {
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [canSkip, setCanSkip] = useState(skipAfter === 0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [bufferPct, setBufferPct] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const videoRef = useRef(null);

  // Reveal skip button after delay
  useEffect(() => {
    if (skipAfter > 0) {
      const t = setTimeout(() => setCanSkip(true), skipAfter * 1000);
      return () => clearTimeout(t);
    }
  }, [skipAfter]);

  // Block background scroll
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  // Compute buffering progress
  const updateBuffer = () => {
    const vid = videoRef.current;
    if (vid && vid.buffered.length && vid.duration) {
      const end = vid.buffered.end(0);
      setBufferPct(Math.min((end / vid.duration) * 100, 100));
    }
  };

  // Attempt playback with fade-in audio
  const attemptPlayback = async () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.src = sources[currentIdx].src;
    vid.preload = 'auto';
    vid.playsInline = true;
    vid.muted = true;
    vid.volume = 0;

    vid.load();
    vid.addEventListener('progress', updateBuffer);
    vid.addEventListener('timeupdate', updateBuffer);

    try {
      await vid.play();
      setStarted(true);
      // fade to 40%
      const target = 0.4;
      const steps = 20;
      const stepVol = target / steps;
      let vol = 0;
      const ramp = setInterval(() => {
        vol = Math.min(vol + stepVol, target);
        vid.volume = vol;
        if (vol >= target) {
          vid.muted = false;
          clearInterval(ramp);
        }
      }, 50);
    } catch (err) {
      console.warn('Playback failed:', err);
      // fallback resolution
      const nextIdx = currentIdx + 1;
      if (nextIdx < sources.length) {
        setErrorCount(errorCount + 1);
        setCurrentIdx(nextIdx);
      } else {
        finish();
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => () => {
    const vid = videoRef.current;
    if (vid) {
      vid.removeEventListener('progress', updateBuffer);
      vid.removeEventListener('timeupdate', updateBuffer);
    }
  }, []);

  // Start playback when user clicks
  const start = () => {
    if (!started) {
      attemptPlayback();
    }
  };

  // Skip or finish
  const finish = () => {
    setVisible(false);
    onFinish?.();
  };

  if (!visible) return null;
  if (!sources.length) {
    console.error('IntroVideo: no sources'); finish(); return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black flex flex-col"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="relative flex-1">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={finish}
          >
            <source src={sources[currentIdx].src} type={sources[currentIdx].type} />
          </video>

          {/* Loading / Buffer UI */}
          {!started && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white cursor-pointer" onClick={start}>
              <Play size={72} className="animate-pulse" />
              <span className="mt-2 text-sm">Click to play intro</span>
            </div>
          )}
          {started && bufferPct < 100 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-gray-600 rounded overflow-hidden">
              <div className="h-full bg-teal-400" style={{ width: `${bufferPct}%` }} />
            </div>
          )}

          {/* Resolution selector */}
          {started && sources.length > 1 && (
            <div className="absolute top-4 right-4 flex items-center space-x-1 text-white text-xs">
              <Settings size={16} />
              <select
                value={currentIdx}
                onChange={(e) => { setCurrentIdx(Number(e.target.value)); setStarted(false); }}
                className="bg-black bg-opacity-50 rounded px-1"
              >
                {sources.map((s, i) => (
                  <option key={s.src} value={i}>{s.label || `${Math.round(parseInt(new URL(s.src).pathname.match(/(\d+)p/)?.[1] || '0'))}p`}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Skip button */}
        {canSkip && started && (
          <motion.button
            onClick={finish}
            className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2 rounded"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            {skipLabel}
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
