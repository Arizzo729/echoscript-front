// src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import PropTypes from 'prop-types';

// Single intro video
import introVideo from '../assets/videos/intro.mp4';

export default function IntroVideo({
  poster,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
  onFinish
}) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const defaultVolume = 0.3;

  // Show controls after delay
  useEffect(() => {
    const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [skipAfter]);

  // Called when the video is ready to play
  const handleCanPlay = () => {
    setLoading(false);
    const vid = videoRef.current;
    if (vid) {
      // retry play if paused
      if (vid.paused) {
        vid.play().catch(() => {});
      }
      // apply mute/volume state
      vid.muted = isMuted;
      vid.volume = defaultVolume;
    }
  };

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
    const vid = videoRef.current;
    if (vid) vid.pause();
    finishIntro();
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (vid) {
      vid.muted = newMuted;
      vid.volume = newMuted ? 0 : defaultVolume;
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
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={handleCanPlay}
          onEnded={finishIntro}
          onError={handleCanPlay}  /* retry on error */
        >
          <source src={introVideo} type="video/mp4" />
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

