import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Repeat, SkipBack, SkipForward, Music2, Minus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

/**
 * AudioOverlay — advanced draggable ambient control UI with track info and responsive controls
 */
export default function AudioOverlay() {
  const { toggleAmbient, trackIndex, isMuted, trackLabel } = useSound();
  const [minimized, setMinimized] = useState(false);
  const [overlaySize, setOverlaySize] = useState('md');
  const x = useMotionValue(12);
  const y = useMotionValue(window.innerHeight - 64);
  const ref = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) {
      x.set(saved.x);
      y.set(saved.y);
    }
  }, [x, y]);

  const handleDragEnd = (_, info) => {
    const m = 12;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const snapX = info.point.x > w / 2
      ? w - m - ref.current.clientWidth
      : m;
    const snapY = info.point.y > h / 2
      ? h - m - ref.current.clientHeight
      : m;
    x.set(snapX);
    y.set(snapY);
    localStorage.setItem('audio-overlay-pos', JSON.stringify({ x: snapX, y: snapY }));
  };

  const isActive = !isMuted && trackIndex > 0;

  const containerClasses = twMerge(
    'fixed z-[9999] shadow-xl transition-all duration-300 rounded-lg overflow-hidden',
    minimized
      ? 'w-10 h-10 backdrop-blur-md bg-zinc-800/60'
      : 'backdrop-blur-lg bg-zinc-900/70 border border-zinc-700/50'
  );

  const sizeClasses = overlaySize === 'lg'
    ? 'w-[320px] h-auto px-4 py-2'
    : overlaySize === 'md'
      ? 'w-[260px] h-auto px-3 py-2'
      : 'w-[200px] h-auto px-2 py-2';

  const buttonClasses = twMerge(
    'p-2 rounded-full focus:outline-none transition-all duration-200 flex items-center justify-center',
    isActive
      ? 'bg-teal-500 text-white hover:bg-teal-600'
      : 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'
  );

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      drag dragMomentum={false} dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={twMerge(containerClasses, sizeClasses)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="w-full h-full flex items-center justify-center text-white text-base"
          aria-label="Restore Audio Overlay"
        >
          🎵
        </button>
      ) : (
        <div className="relative flex flex-col space-y-2">
          <button
            onClick={() => setMinimized(true)}
            className="absolute -top-2 -right-2 text-xs bg-zinc-800 text-gray-300 hover:text-white rounded-full px-1"
            aria-label="Minimize Overlay"
          >
            ✕
          </button>

          <div className="flex items-center justify-between">
            <button
              onClick={toggleAmbient}
              className={buttonClasses}
              aria-label="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center justify-center text-white text-xs px-2">
              <Music2 className="w-4 h-4 text-teal-400 mb-1" />
              <span className="font-medium text-center">
                {isMuted ? 'Muted' : trackLabel || `Track ${trackIndex}`}
              </span>
            </div>
            <button
              onClick={toggleAmbient}
              className={buttonClasses}
              aria-label="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-center space-x-1 pt-1">
            {['sm', 'md', 'lg'].map(size => (
              <button
                key={size}
                className={twMerge(
                  'w-4 h-4 rounded-full border',
                  overlaySize === size ? 'bg-teal-500 border-teal-600' : 'bg-zinc-600 border-zinc-500'
                )}
                onClick={() => setOverlaySize(size)}
                aria-label={`Set size ${size}`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

