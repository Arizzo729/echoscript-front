import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import introVideo from '../assets/videos/intro.mp4';

export default function IntroVideo({
  poster,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
  sources = [{ src: introVideo, type: 'video/mp4' }],
  onFinish,
}) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const defaultVolume = 1;

  // Skip if already played this session
  useEffect(() => {
    if (window.__introPlayed) {
      navigate('/', { replace: true });
    } else {
      window.__introPlayed = true;
    }
  }, [navigate]);

  // Load, unmute, and play
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playsInline = true;
    v.preload = 'auto';
    v.defaultPlaybackRate = 1;
    v.muted = muted;
    v.volume = defaultVolume;
    sources.forEach(({ src, type }) => {
      const source = document.createElement('source');
      source.src = src;
      source.type = type;
      v.appendChild(source);
    });
    v.load();
    v.play().catch(() => {
      // user interaction may be needed
    });
  }, [muted, sources]);

  // Show controls after delay
  useEffect(() => {
    const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [skipAfter]);

  const handleCanPlay = () => setLoading(false);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const finishIntro = () => {
    navigate('/', { replace: true });
    const ov = overlayRef.current;
    const done = () => onFinish?.();
    if (ov) {
      ov.classList.add('opacity-0');
      ov.addEventListener('transitionend', done, { once: true });
    } else {
      done();
    }
  };

  const handleSkip = () => {
    const v = videoRef.current;
    v?.pause();
    finishIntro();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out"
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
          poster={poster}
          muted={muted}
          onCanPlay={handleCanPlay}
          onEnded={finishIntro}
          onError={handleCanPlay}
        />

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
              className="bg-white/20 hover:bg-white/40 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg flex items-center space-x-1 transition"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{muted ? 'Unmute' : 'Mute'}</span>
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
  sources: PropTypes.arrayOf(
    PropTypes.shape({ src: PropTypes.string.isRequired, type: PropTypes.string.isRequired })
  ),
  onFinish: PropTypes.func,
};

