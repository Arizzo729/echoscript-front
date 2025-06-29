// src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import PropTypes from 'prop-types';

import intro1440 from '../assets/videos/intro-1440p.mp4';
import intro720 from '../assets/videos/intro-720p.mp4';
import intro480 from '../assets/videos/intro-480p.mp4';

const defaultSources = [
  { src: intro1440, type: 'video/mp4', resolution: 1440 },
  { src: intro720,  type: 'video/mp4', resolution:  720 },
  { src: intro480,  type: 'video/mp4', resolution:  480 }
];

export default function IntroVideo({ sources = defaultSources, poster, skipAfter = 3, skipLabel = 'Skip Intro', onFinish }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  // Sort once on mount
  const sorted = React.useMemo(() => [...sources].sort((a, b) => b.resolution - a.resolution), [sources]);

  // Attempt play & schedule controls visibility
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.playsInline = true;
    vid.src = sorted[srcIndex].src;
    vid.load();

    vid
      .play()
      .catch(() => {
        // on autoplay failure, keep loading spinner
      });

    const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [sorted, srcIndex, skipAfter]);

  // Hide spinner when ready
  const handleCanPlay = () => setLoading(false);

  // On error, fallback to next source
  const handleError = () => {
    if (srcIndex + 1 < sorted.length) {
      setSrcIndex((i) => i + 1);
      setLoading(true);
    } else {
      // no more sources, finish
      finishIntro();
    }
  };

  // Fade out & finish
  const finishIntro = () => {
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.classList.add('opacity-0');
      overlay.addEventListener('transitionend', () => onFinish?.(), { once: true });
    } else {
      onFinish?.();
    }
  };

  const handleSkip = () => {
    videoRef.current.pause();
    finishIntro();
  };

  // Unmute with fade-in
  const handleUnmute = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      let vol = 0;
      vid.volume = 0;
      const fade = setInterval(() => {
        vol += 0.05;
        if (vol >= 1) {
          vid.volume = 1;
          clearInterval(fade);
        } else vid.volume = vol;
      }, 100);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        key="intro-overlay"
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-700"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin border-4 border-teal-500 border-t-transparent rounded-full h-12 w-12" />
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={handleCanPlay}
          onEnded={finishIntro}
          onError={handleError}
        >
          {sorted.map((s, i) => (
            <source key={i} src={s.src} type={s.type} />
          ))}
          <p className="text-white">Your browser does not support embedded videos.</p>
        </video>

        {controlsVisible && (
          <motion.div
            className="absolute bottom-6 right-6 flex space-x-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
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
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

IntroVideo.propTypes = {
  sources: PropTypes.array,
  poster: PropTypes.string,
  skipAfter: PropTypes.number,
  skipLabel: PropTypes.string,
  onFinish: PropTypes.func,
};
