import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Minus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

export default function AudioOverlay() {
  const { toggleAmbient, trackIndex, isMuted, currentTrackName, isPlaying, togglePlayPause, nextTrack, prevTrack } = useSound();
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
    'fixed z-[9999] shadow-xl rounded-lg overflow-hidden resize min-w-[200px] min-h-[50px] max-w-[400px] max-h-[100px] transition-all duration-300',
    minimized
      ? 'w-8 h-8 backdrop-blur-md bg-transparent border border-teal-500'
      : 'flex items-center justify-between px-4 py-2 space-x-4 backdrop-blur-lg bg-zinc-900/70 border border-zinc-700/50'
  );

  const iconBtn = 'w-5 h-5 text-teal-400 hover:text-white transition';

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      drag dragMomentum={false} dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={containerClasses}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="w-full h-full flex items-center justify-center text-teal-400 text-lg"
          aria-label="Restore Audio Overlay"
        >
          🎵
        </button>
      ) : (
        <>
          <button
            onClick={() => setMinimized(true)}
            className="absolute top-1 right-2 text-teal-400 hover:text-white"
            aria-label="Minimize Audio Overlay"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={prevTrack}
            className={iconBtn}
            aria-label="Previous Track"
          >
            <ChevronLeft className={iconBtn} />
          </button>

          <button
            onClick={togglePlayPause}
            className={iconBtn}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className={iconBtn} /> : <Play className={iconBtn} />}
          </button>

          <button
            onClick={nextTrack}
            className={iconBtn}
            aria-label="Next Track"
          >
            <ChevronRight className={iconBtn} />
          </button>

          {isActive && (
            <span className="ml-3 text-sm text-teal-300 truncate max-w-[150px]">
              {currentTrackName || 'Now Playing'}
            </span>
          )}
        </>
      )}
    </motion.div>
  );
}



