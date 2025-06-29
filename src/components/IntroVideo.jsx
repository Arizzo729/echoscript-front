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
  // track "user wants it muted?" solely for the button icon/text
  const [userMuted, setUserMuted] = useState(false);
  const defaultVolume = 0.3;

  // schedule controls
  useEffect(() => {
    const t = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(t);
  }, [skipAfter]);

  // mount: set up video and autoplay (muted attr satisfies policy)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.src = introVideo;
    v.playsInline = true;
    v.muted = true;     // static, ensures autoplay
    v.volume = defaultVolume;
    v.load();
    v.play().catch(() => {});
  }, []);

  // once enough data is buffered, remove spinner
  const handleCanPlay = () => {
    setLoading(false);
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

  // ** never touch the <video muted> attribute in JSX **
  // only toggle the actual DOM property
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const nowMuted = !v.muted;
    v.muted = nowMuted;
    if (!nowMuted) {
      v.volume = defaultVolume;        // restore volume
      v.play().catch(() => {});       // safety in case it paused
    }
    setUserMuted(nowMuted);
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
          muted       {/* keep this static */}
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={handleCanPlay}
          onEnded={finishIntro}
          onError={handleCanPlay}
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
              <span>{userMuted ? 'Unmuted' : 'Muted'}</span>
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
