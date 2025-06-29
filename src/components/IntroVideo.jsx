import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Volume2 } from 'lucide-react';

/**
 * IntroVideo — Fullscreen cross-browser intro with auto-play, multiple fallbacks,
 * muted for autoplay compliance, inline playback on iOS, and custom controls.
 * Works on Chrome, Edge, Firefox, Safari (desktop & mobile).
 *
 * Props:
 * - sources: Array<{ src: string; type: string; resolution: number }>
 *   (resolution = height in px; highest first)
 * - poster?: string              // preview image URL
 * - skipAfter?: number           // seconds until controls appear (default: 3)
 * - skipLabel?: string           // skip button text (default: 'Skip Intro')
 * - onFinish?: () => void        // callback when video ends or skip pressed
 */
const defaultSources = [
  { src: '/videos/intro-1440p.mp4', type: 'video/mp4', resolution: 1440 },
  { src: '/videos/intro-720p.mp4',  type: 'video/mp4', resolution: 720 },
  { src: '/videos/intro-480p.mp4',  type: 'video/mp4', resolution: 480 },
];

export default function IntroVideo({
  sources = defaultSources,
  poster,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
  onFinish,
}) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  // Sort sources by resolution descending
  const sorted = [...sources].sort((a, b) => b.resolution - a.resolution);

  // Attempt autoplay (muted) on mount for browsers
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      vid.playsInline = true;
      const playPromise = vid.play();
      if (playPromise?.catch) {
        playPromise.catch((e) => console.warn('Autoplay prevented:', e));
      }
    }
  }, []);

  // Show custom controls after delay
  useEffect(() => {
    const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [skipAfter]);

  const handleLoaded = () => setLoading(false);
  const handleError = (e) => {
    console.error('IntroVideo load error:', e);
    onFinish?.();
  };
  const handleFinish = () => onFinish?.();

  const handleUnmute = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      vid.volume = 1;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="intro-video"
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Spinner while video loads */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin border-4 border-teal-500 border-t-transparent rounded-full h-12 w-12" />
          </div>
        )}

        {/* Video element with multiple <source> fallbacks */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover bg-black"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={poster}
          onLoadedData={handleLoaded}
          onEnded={handleFinish}
          onError={handleError}
          controls={false}
          disablePictureInPicture
        >
          {sorted.map((s, idx) => (
            <source key={idx} src={s.src} type={s.type} />
          ))}
          <p className="text-white">Your browser does not support embedded videos.</p>
        </video>

        {/* Custom controls: Skip & Unmute */}
        {controlsVisible && (
          <div className="absolute bottom-6 right-6 flex space-x-3">
            <button
              onClick={handleFinish}
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
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}




