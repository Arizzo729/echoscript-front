import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import PropTypes from 'prop-types';
import introVideo from '../assets/videos/intro.mp4';

const overlayVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0, transition: { duration: 0.8 } },
};

const controlsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function IntroVideo({
  poster,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
  sources = [{ src: introVideo, type: 'video/mp4' }],
  onFinish,
}) {
  const videoRef = useRef(null);
  const controlsAnim = useAnimation();
  const hasLoaded = useRef(false);

  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [visible, setVisible] = useState(true);
  const defaultVolume = 0.3;

  // Run intro once per page load
  useEffect(() => {
    if (window.__introPlayed) {
      setVisible(false);
    } else {
      window.__introPlayed = true;
    }
  }, []);

  // Load video sources and play only once when visible
  useEffect(() => {
    if (!visible || hasLoaded.current) return;
    const v = videoRef.current;
    if (!v) return;
    hasLoaded.current = true;

    v.playsInline = true;
    v.preload = 'auto';
    v.defaultPlaybackRate = 1;
    sources.forEach(({ src, type }) => {
      const source = document.createElement('source');
      source.src = src;
      source.type = type;
      v.appendChild(source);
    });
    v.muted = true;
    v.volume = defaultVolume;
    v.play().catch(() => {});
  }, [visible, sources]);

  // Toggle mute without reloading
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = muted;
      if (!muted) v.volume = defaultVolume;
    }
  }, [muted]);

  // Reveal controls
  useEffect(() => {
    if (!visible) return;
    const show = async () => {
      await controlsAnim.start({ opacity: 0 });
      await new Promise(r => setTimeout(r, skipAfter * 1000));
      await controlsAnim.start('visible');
    };
    show();
  }, [skipAfter, visible, controlsAnim]);

  const handleCanPlay = () => setLoading(false);
  const toggleMute = () => setMuted(prev => !prev);

  const exitSequence = async () => {
    await controlsAnim.start('hidden');
    setVisible(false);
    onFinish?.();
  };

  const handleSkip = () => {
    const v = videoRef.current;
    if (v) v.pause();
    exitSequence();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          variants={overlayVariants}
          initial="visible"
          animate="visible"
          exit="hidden"
        >
          {loading && (
            <motion.div className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="animate-spin border-4 border-teal-500 border-t-transparent rounded-full h-12 w-12" />
            </motion.div>
          )}

          <motion.video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay playsInline preload="auto"
            poster={poster}
            muted={muted}
            onCanPlay={handleCanPlay}
            onEnded={exitSequence}
            width="1920"
            height="1080"
            style={{ filter: 'brightness(1.05) contrast(1.1)' }}
          />

          <motion.div
            className="absolute bottom-6 right-6 flex space-x-3"
            custom={0}
            variants={controlsVariants}
            initial="hidden"
            animate={controlsAnim}
          >
            <motion.button
              onClick={handleSkip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-teal-500/60 hover:bg-teal-500/80 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg"
            >
              {skipLabel}
            </motion.button>

            <motion.button
              onClick={toggleMute}
              custom={1}
              variants={controlsVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 hover:bg-white/40 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg flex items-center space-x-1"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{muted ? 'Unmute' : 'Mute'}</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
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



