import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Volume2 } from 'lucide-react';

/**
 * IntroVideo — Fullscreen intro that auto-plays at highest available resolution.
 * Automatically plays muted for autoplay compliance, shows loading state,
 * offers skip and unmute controls once ready. Prioritizes 1440p/downbased on sources.
 *
 * Props:
 * - sources: Array<
 *     string | { src: string; type?: string; resolution?: number }
 *   > (user-supplied list; resolution in pixels height)
 * - poster?: string              // preview image
 * - skipAfter?: number           // seconds until controls appear (default: 3)
 * - skipLabel?: string           // skip button text (default: 'Skip Intro')
 * - onFinish?: () => void        // callback when video ends or is skipped
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

  // Infer MIME type by extension
  const inferType = (src) => {
    const ext = src.split('?')[0].split('.').pop().toLowerCase();
    if (ext === 'mp4') return 'video/mp4';
    if (ext === 'webm') return 'video/webm';
    if (ext === 'ogv' || ext === 'ogg') return 'video/ogg';
    return '';
  };

  // Build normalized sources with resolution and type
  const normalized = sources.map((s) => {
    if (typeof s === 'string') {
      return { src: s, type: inferType(s), resolution: 360 };
    }
    return {
      src: s.src,
      type: s.type || inferType(s.src),
      resolution: s.resolution || 360,
    };
  });

  // Sort sources descending by resolution
  normalized.sort((a, b) => b.resolution - a.resolution);
  const best = normalized[0];

  // Auto-play muted on mount for autoplay compliance
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise?.catch) {
        playPromise.catch((err) => console.warn('Autoplay prevented:', err));
      }
    }
  }, []);

  // Show controls after skipAfter seconds
  useEffect(() => {
    const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [skipAfter]);

  const handleLoaded = () => setLoading(false);
  const handleError = (e) => {
    console.warn('IntroVideo load error:', e);
    onFinish?.();
  };
  const handleFinish = () => onFinish?.();

  // Unmute when user clicks
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
        {/* Spinner while loading */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin border-4 border-teal-500 border-t-transparent rounded-full h-12 w-12" />
          </div>
        )}

        {/* Video element using only the best resolution source */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover bg-black"
          src={best.src}
          type={best.type}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={poster}
          onLoadedData={handleLoaded}
          onError={handleError}
          onEnded={handleFinish}
        >
          <p className="text-white">Your browser does not support videos.</p>
        </video>

        {/* Controls: Skip & Unmute */}
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


