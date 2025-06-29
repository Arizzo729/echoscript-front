import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Volume2 } from 'lucide-react';

/**
 * IntroVideo — Reliable fullscreen intro with automatic play, correct MIME types,
 * optional audio controls, loading state, multiple fallbacks, and a themed skip button.
 *
 * Props:
 * - sources: Array<string | { src: string; type?: string }> (highest priority first)
 * - poster?: string — preview image (optional)
 * - skipAfter?: number — seconds until controls appear (default: 3)
 * - skipLabel?: string — text for skip button (default: 'Skip Intro')
 * - onFinish?: () => void — callback when video ends or skip is pressed
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

  // Infer MIME type from file extension
  const inferType = (src) => {
    const ext = src.split('?')[0].split('.').pop().toLowerCase();
    switch (ext) {
      case 'mp4': return 'video/mp4';
      case 'webm': return 'video/webm';
      case 'ogg': return 'video/ogg';
      default: return '';
    }
  };

  // Show controls (skip/unmute) after skipAfter seconds
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

  // Unmute on user click
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
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin border-4 border-teal-500 border-t-transparent rounded-full h-12 w-12" />
          </div>
        )}

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
            const srcUrl = typeof source === 'string' ? source : source.src;
            const type = typeof source === 'string'
              ? inferType(srcUrl)
              : source.type || inferType(srcUrl);
            return (
              <source key={idx} src={srcUrl} type={type} />
            );
          })}
          <p className="text-white">Your browser does not support embedded videos.</p>
        </video>

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



