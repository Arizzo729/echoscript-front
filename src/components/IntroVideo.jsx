// src/components/IntroVideo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import PropTypes from 'prop-types';
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
  // We'll keep track of whether the user has actively muted.
  const [userMuted, setUserMuted] = useState(false);
  // Our default starting volume:
  const defaultVolume = 0.3;

  // Show controls after a delay
  useEffect(() => {
    const t = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(t);
  }, [skipAfter]);

  // On mount: load & autoplay muted
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.src = introVideo;
    v.playsInline = true;
    v.muted = true;     // start muted
    v.load();
    v.play().catch(() => {});
  }, []);

  // When the video is ready, unmute at default volume (if user hasn't muted)
  const handleCanPlay = () => {
    setLoading(false);
    const v = videoRef.current;
    if (!v) return;
    if (!userMuted) {
      v.muted = false;
      v.volume = defaultVolume;
    }
    // safety play() in case it stalled
    if (v.paused) v.play().catch(() => {});
  };

  const finishIntro = () => {
    const ov = overlayRef.current;
    if (ov) {
      ov.classList.add('opacity-0');
      ov.addEventListener('transitionend', () => onFinish?.(), { once: true });
    } else {
      onFinish?.();
    }
  };

  const handleSkip = () => {
    const v = videoRef.current; 
    if (v) v.pause();
    finishIntro();
  };

  // Toggle mute/unmute manually
  const toggleMute = () => {
    const v = videoRef.current;
    const next = !userMuted;
    setUserMuted(next);
    if (!v) return;
    if (next) {
      v.muted = true;
    } else {
      v.muted = false;
      v.volume = defaultVolume;
      v.play().catch(() => {});
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
          muted       // static to permit autoplay
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={handleCanPlay}
          onEnded={finishIntro}
          onError={handleCanPlay}
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
              className="bg-teal-500/60 hover:bg-teal-500/80 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg"
            >
              {skipLabel}
            </button>
            <button
              onClick={toggleMute}
              className="bg-white/20 hover:bg-white/40 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg flex items-center space-x-1"
            >
              {userMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{userMuted ? 'Unmute' : 'Mute'}</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

IntroVideo.propTypes = {
  poster:    PropTypes.string,
  skipAfter: PropTypes.number,
  skipLabel: PropTypes.string,
  onFinish:  PropTypes.func,
};
