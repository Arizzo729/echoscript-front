import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import PropTypes from 'prop-types';
import introVideo from '../assets/videos/intro.mp4';

export default function IntroVideo({ poster, skipAfter = 3, skipLabel = 'Skip Intro', onFinish }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [userMuted, setUserMuted] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const defaultVolume = 0.1; // 🔉 quieter

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.src = introVideo;
    v.playsInline = true;
    v.muted = true;
    v.volume = defaultVolume;
    v.load();
    v.play().catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [skipAfter]);

  const handleCanPlay = () => {
    setLoading(false);
    const v = videoRef.current;
    if (v && interacted) {
      v.muted = userMuted;
      v.volume = userMuted ? 0 : defaultVolume;
      v.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!interacted) setInteracted(true);
    const next = !userMuted;
    v.muted = next;
    v.volume = next ? 0 : defaultVolume;
    v.play().catch(() => {});
    setUserMuted(next);
  };

  const handleSkip = () => {
    const v = videoRef.current;
    if (v) {
      setInteracted(true);
      v.pause();
    }
    finishIntro();
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
          playsInline
          preload="auto"
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
              {userMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{userMuted ? 'Unmute' : 'Mute'}</span>
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

