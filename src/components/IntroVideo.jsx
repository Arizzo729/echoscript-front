import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Volume2 } from 'lucide-react';

/**
 * IntroVideo — Cross-browser fullscreen intro with auto-play, multiple fallbacks,
 * muting for autoplay compliance, playsInline support for iOS, and custom controls.
 * Works on Chrome, Edge, Firefox, Safari (desktop & mobile).
 *
 * Props:
 * - sources: Array<
 *     string | { src: string; type?: string; resolution?: number }
 *   > (highest priority first; resolution = height in px)
 * - poster?: string              // preview image
 * - skipAfter?: number           // seconds until skip/unmute appear (default: 3)
 * - skipLabel?: string           // skip button text (default: 'Skip Intro')
 * - onFinish?: () => void        // callback when video ends or skip pressed
 */
export default function IntroVideo({
  sources = [],
  poster,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
  onFinish,
}) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  // Guard empty sources
  if (!sources || sources.length === 0) {
    console.error('IntroVideo: no sources provided');
    return null;
  }

  // Infer MIME from extension
  const inferType = (url) => {
    const ext = url.split('?')[0].split('.').pop().toLowerCase();
    if (ext === 'mp4') return 'video/mp4';
    if (ext === 'webm') return 'video/webm';
    if (ext === 'ogv' || ext === 'ogg') return 'video/ogg';
    return '';
  };

  // Normalize and sort by resolution descending
  const normalized = sources.map((s) => {
    if (typeof s === 'string') {
      return { src: s, type: inferType(s), resolution: 360 };
    }
    return {
      src: s.src,
      type: s.type || inferType(s.src),
      resolution: s.resolution || 360,
    };
  }).sort((a, b) => (b.resolution || 0) - (a.resolution || 0));

  const bestSource = normalized[0];

  // Attempt autoplay (muted) on mount for browsers
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => console.warn('Autoplay prevented:', err));
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
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin border-4 border-teal-500 border-t-transparent rounded-full h-12 w-12" />
          </div>
        )}

        {/* Responsive, full-bleed video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover bg-black"
          src={bestSource.src}
          type={bestSource.type}
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          poster={poster}
          onLoadedData={handleLoaded}
          onEnded={handleFinish}
          onError={handleError}
          disablePictureInPicture
          controls={false}
        >
          {/* Additional fallbacks for older browsers */}
          {normalized.slice(1).map((s, idx) => (
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



