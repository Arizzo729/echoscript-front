// src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import PropTypes from 'prop-types';

// Single intro video file
import introVideo from '../assets/videos/intro.mp4';

export default function IntroVideo({ poster, skipAfter = 3, skipLabel = 'Skip Intro', onFinish }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const defaultVolume = 0.3;
  const [isMuted, setIsMuted] = useState(false);
  const defaultVolume = 0.3;

  // Initialize playback
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.playsInline = true;
    vid.src = introVideo;
    vid.load();
    vid.volume = defaultVolume;
    vid.muted = false;
    vid.play().catch(() => {});

    const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [skipAfter]);

  // Update mute state without reloading
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = isMuted;
    vid.volume = isMuted ? 0 : defaultVolume;
  }, [isMuted]);

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

  // Toggle mute and preserve playback
  const toggleMute = () => {
    setIsMuted((m) => !m);
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
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={handleCanPlay}
          onEnded={finishIntro}
          onError={finishIntro}
        >
          <source src={introVideo} type="video/mp4" />
          <p className="text-white">Your browser does not support embedded videos.</p>
        </video>

        {controlsVisible && (
          <motion.div
            className="absolute bottom-6 right-6 flex space-x-3"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }}
          >
            <button
              onClick={handleSkip}
              className="bg-teal-500/60 hover:bg-teal-500/80 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg transition"
            >
              {skipLabel}
            </button>
            <button
              onClick={toggleMute}
              className="bg-white/20 hover:bg-white/40 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg transition flex items-center space-x-1"
            >
              {isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
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

