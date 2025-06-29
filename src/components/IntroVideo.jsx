import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Volume2 } from 'lucide-react';

/**
 * IntroVideo — High-resolution, fullscreen intro with optional audio.
 * Autoplays muted for browser compliance, then offers Unmute and Skip UI.
 * Uses native <video> with multiple <source> fallbacks and themed controls.
 *
 * Props:
 * - sources: Array<string | { src: string; type?: string }> (highest priority first)
 * - poster?: string — preview image before load
 * - skipAfter?: number — seconds until controls appear (default: 3)
 * - skipLabel?: string — text for skip button (default: 'Skip Intro')
 * - onFinish?: () => void — callback when video ends or is skipped
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

  // Show Skip & Unmute after delay
  useEffect(() => {
    const timer = setTimeout(() => setControlsVisible(true), skipAfter * 1000);
    return () => clearTimeout(timer);
  }, [skipAfter]);

  const handleLoaded = () => {
    setLoading(false);
  };
  const handleError = (e) => {
    console.warn('IntroVideo load error:', e);
    onFinish?.();
  };
  const handleFinish = () => onFinish?.();

  // Unmute on user click
  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
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

        {/* Native video element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain bg-black"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={poster}
          onLoadedData={handleLoaded}
          onError={handleError}
          onEnded={handleFinish}
        >
          {sources.map((source, idx) => {
            if (typeof source === 'string') {
              return <source key={idx} src={source} />;
            } else {
              return (
                <source
                  key={idx}
                  src={source.src}
                  type={source.type || ''}
                />
              );
            }
          })}
          <p className="text-white">Your browser does not support embedded videos.</p>
        </video>

        {/* Skip & Unmute Controls */}
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


