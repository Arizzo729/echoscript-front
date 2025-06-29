// src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import PropTypes from 'prop-types';

// Single 1080p source
import intro1080 from '../assets/videos/intro.mp4';

export default function IntroVideo({ poster, skipAfter = 3, skipLabel = 'Skip Intro', onFinish }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  // Attempt play & schedule controls visibility
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.playsInline = true;
    vid.src = intro1080;
    vid.load();

    vid.play().catch(() => {});
    const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [skipAfter]);

  const handleCanPlay = () => setLoading(false);

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
        initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
          onError={finishIntro}
        >
          <source src={intro1080} type="video/mp4" />
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
  poster: PropTypes.string,
  skipAfter: PropTypes.number,
  skipLabel: PropTypes.string,
  onFinish: PropTypes.func,
};
