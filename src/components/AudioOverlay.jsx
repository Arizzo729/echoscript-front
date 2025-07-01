import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Repeat } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

/**
 * AudioOverlay — high-end draggable ambient control UI
 */
export default function AudioOverlay() {
  const { toggleAmbient, trackIndex, isMuted } = useSound();
  const [minimized, setMinimized] = useState(false);
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
    'fixed z-[9999] shadow-xl rounded-full overflow-hidden transition-all duration-300',
    minimized
      ? 'w-8 h-8 backdrop-blur-md bg-zinc-800/60'
      : 'flex items-center justify-center px-3 py-1 space-x-2 backdrop-blur-lg bg-zinc-900/70 hover:bg-zinc-800/70 border border-zinc-700/50'
  );

  const buttonClasses = twMerge(
    'p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
    isActive
      ? 'bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500'
      : 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600 focus:ring-zinc-500'
  );

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      drag dragMomentum={false} dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={containerClasses}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
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
        <>
          <button
            onClick={() => setMinimized(true)}
            className="absolute -top-2 -right-2 text-xs bg-zinc-800 text-gray-300 hover:text-white rounded-full px-1"
            aria-label="Minimize Overlay"
          >
            ✕
          </button>

          <button
            onClick={e => { e.stopPropagation(); toggleAmbient(); }}
            className={buttonClasses}
            aria-label="Cycle Background Music"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </>
      )}
    </motion.div>
  );
}
