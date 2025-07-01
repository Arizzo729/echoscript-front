// src/components/AudioOverlay.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Repeat } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

/**
 * AudioOverlay — slim draggable control panel for cycling ambient tracks
 */
export default function AudioOverlay() {
  const {
    toggleAmbient,
    nowPlaying,
    trackIndex,
    isMuted,
    volume,
    setVolume,
    sfxMuted,
    setSfxMuted,
  } = useSound();

  const [minimized, setMinimized] = useState(false);
  const x = useMotionValue(12);
  const y = useMotionValue(window.innerHeight - 64);
  const wrapperRef = useRef(null);

  // Load saved position
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) {
      x.set(saved.x);
      y.set(saved.y);
    }
  }, [x, y]);

  // Snap to nearest corner on drag end
  const handleDragEnd = (_, info) => {
    const margin = 12;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const snapX = info.point.x > w / 2
      ? w - margin - wrapperRef.current.clientWidth
      : margin;
    const snapY = info.point.y > h / 2
      ? h - margin - wrapperRef.current.clientHeight
      : margin;
    x.set(snapX);
    y.set(snapY);
    localStorage.setItem('audio-overlay-pos', JSON.stringify({ x: snapX, y: snapY }));
  };

  const isActive = !isMuted && trackIndex > 0;

  // Dynamic classes for panel
  const panelClasses = twMerge(
    'fixed z-50 pointer-events-auto bg-zinc-900/70 dark:bg-zinc-800/70 backdrop-blur-lg rounded-xl shadow-lg',
    minimized
      ? 'w-8 h-8 p-0'
      : 'px-2 py-1 flex items-center space-x-2'
  );

  // Cycle button classes
  const cycleButtonClasses = twMerge(
    'flex items-center justify-center p-1 rounded-full transition-colors duration-200',
    isActive
      ? 'bg-teal-500 hover:bg-teal-600 text-white'
      : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
  );

  return (
    <motion.div
      ref={wrapperRef}
      style={{ x, y }}
      drag
      dragMomentum={false}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={panelClasses}
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
          {/* Minimize */}
          <button
            onClick={() => setMinimized(true)}
            className="absolute -top-1 -right-1 text-xs text-gray-400 hover:text-white focus:outline-none"
            aria-label="Minimize Overlay"
          >
            ✕
          </button>

          {/* Cycle Music */}
          <button
            onClick={e => { e.stopPropagation(); toggleAmbient(); }}
            className={cycleButtonClasses}
            aria-label="Cycle Background Music"
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Now Playing */}
          <span
            className={twMerge(
              'text-xs font-medium whitespace-nowrap',
              isActive ? 'text-teal-300' : 'text-zinc-400'
            )}
          >
            {isActive ? nowPlaying : 'Off'}
          </span>

          {/* Volume Slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-white rounded cursor-pointer"
            aria-label="Volume"
          />

          {/* SFX Toggle */}
          <button
            onClick={() => setSfxMuted(prev => !prev)}
            className={twMerge(
              'p-1 text-sm rounded-full transition-colors',
              sfxMuted
                ? 'text-zinc-500 hover:text-zinc-400'
                : 'text-teal-400 hover:text-teal-300'
            )}
            aria-label="Toggle SFX"
          >
            {sfxMuted ? '🔇' : '🔊'}
          </button>
        </>
      )}
    </motion.div>
  );
}

