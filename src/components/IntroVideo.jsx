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
  const [mutedByUser, setMutedByUser] = useState(false);
  const DEFAULT_VOL = 0.3;

  // show skip/mute controls after a delay
  useEffect(() => {
    const id = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(id);
  }, [skipAfter]);

  // once metadata is loaded, the browser has enough to play
  // so we unmute to DEFAULT_VOL (unless user already muted)
  const onLoadedMeta = () => {
    setLoading(false);
    const v = videoRef.current;
    if (!v) return;
    if (!mutedByUser) {
      v.muted = false;
      v.volume = DEFAULT_VOL;
    }
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

  // user-requested mute/unmute
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const nowMuted = !v.muted;
    v.muted = nowMuted;
    if (!nowMuted) v.volume = DEFAULT_VOL;
    setMutedByUser(nowMuted);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        key="intro"
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
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
          onLoadedMetadata={onLoadedMeta}
          onEnded={finishIntro}
        >
          <source src={introVideo} type="video/mp4" />
          <p className="text-white">
            Your browser does not support embedded videos.
          </p>
        </video>

        {controlsVisible && (
          <motion.div
            className="absolute bottom-6 right-6 flex space-x-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <button
              onClick={handleSkip}
              className="bg-teal-500/60 hover:bg-teal-500/80 text-white py-2 px-4 rounded-lg"
            >
              {skipLabel}
            </button>
            <button
              onClick={toggleMute}
              className="bg-white/20 hover:bg-white/40 text-white py-2 px-4 rounded-lg flex items-center space-x-1"
            >
              {videoRef.current?.muted
                ? <Volume2 size={16} />
                : <VolumeX size={16} />}
              <span>{videoRef.current?.muted ? 'Unmute' : 'Mute'}</span>
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

