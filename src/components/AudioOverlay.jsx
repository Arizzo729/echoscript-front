import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Repeat, SkipBack, SkipForward, Minus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

export default function AudioOverlay() {
  const { toggleAmbient, trackIndex, isMuted, prevTrack, nextTrack } = useSound();
  const [minimized, setMinimized] = useState(false);
  const [size, setSize] = useState({ width: 260, height: 48 });
  const x = useMotionValue(12);
  const y = useMotionValue(window.innerHeight - 80);
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
    const el = ref.current;
    const snapX = Math.min(Math.max(m, info.point.x), w - el.offsetWidth - m);
    const snapY = Math.min(Math.max(m, info.point.y), h - el.offsetHeight - m);
    x.set(snapX);
    y.set(snapY);
    localStorage.setItem('audio-overlay-pos', JSON.stringify({ x: snapX, y: snapY }));
  };

  const startResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMove = (e) => {
      const newWidth = Math.min(Math.max(200, startWidth + e.clientX - startX), 500);
      const newHeight = Math.min(Math.max(40, startHeight + e.clientY - startY), 100);
      setSize({ width: newWidth, height: newHeight });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const isActive = !isMuted && trackIndex > 0;

  const containerClasses = twMerge(
    'fixed z-[9999] rounded-lg transition-all duration-300 border border-zinc-700 backdrop-blur-xl',
    minimized ? 'w-8 h-8' : 'flex items-center px-4 py-2 gap-2 bg-zinc-900/70'
  );

  const iconBtn = 'text-zinc-300 hover:text-teal-400 transition p-1';

  return (
    <motion.div
      ref={ref}
      style={{ x, y, width: size.width, height: size.height }}
      drag dragMomentum={false} dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={containerClasses}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="w-full h-full flex items-center justify-center text-zinc-300 hover:text-white"
          aria-label="Restore Audio Overlay"
        >
          🎵
        </button>
      ) : (
        <>
          <button
            onClick={() => setMinimized(true)}
            className="absolute -top-1.5 -right-2 text-zinc-400 hover:text-white"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <button onClick={prevTrack} aria-label="Previous Track" className={iconBtn}>
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={toggleAmbient}
              aria-label="Cycle Track"
              className={iconBtn}
            >
              <Repeat className="w-5 h-5" />
            </button>

            <button onClick={nextTrack} aria-label="Next Track" className={iconBtn}>
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      {/* Resize corner */}
      {!minimized && (
        <div
          onMouseDown={startResize}
          className="absolute bottom-1 right-1 w-3 h-3 cursor-nwse-resize z-50"
        />
      )}
    </motion.div>
  );
}


