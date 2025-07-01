import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Repeat } from 'lucide-react';
import { useSound } from '../context/SoundContext';

/**
 * AudioOverlay — streamlined draggable ambient control.
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
    setSfxMuted
  } = useSound();
  const [minimized, setMinimized] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const wrapperRef = useRef(null);

  // Load saved position
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) {
      x.set(saved.x);
      y.set(saved.y);
    }
  }, [x, y]);

  // Snap to nearest corner and persist
  const handleDragEnd = (_, info) => {
    const margin = 12;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const posX = info.point.x;
    const posY = info.point.y;
    const snapX = posX > w / 2 ? w - margin - wrapperRef.current.clientWidth : margin;
    const snapY = posY > h / 2 ? h - margin - wrapperRef.current.clientHeight : margin;
    x.set(snapX);
    y.set(snapY);
    localStorage.setItem('audio-overlay-pos', JSON.stringify({ x: snapX, y: snapY }));
  };

  // Panel styling
  const basePanel = 'bg-zinc-900/50 backdrop-blur-md rounded-full shadow-lg flex items-center space-x-2 pointer-events-auto';

  return (
    <motion.div
      ref={wrapperRef}
      className="fixed z-50"
      style={{ x, y }}
      drag
      dragMomentum={false}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {minimized ? (
        <div
          className="w-10 h-10 bg-zinc-800/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg cursor-move text-lg text-white"
          onClick={() => setMinimized(false)}
          aria-label="Restore Audio Controls"
        >
          🎵
        </div>
      ) : (
        <div className={`${basePanel} px-3 py-2`}>          
          {/* Minimize button */}
          <button
            onClick={() => setMinimized(true)}
            className="absolute -top-1 -right-1 text-xs text-gray-400 hover:text-white focus:outline-none"
            aria-label="Minimize"
          >
            ✕
          </button>

          {/* Cycle music button */}
          <button
            onClick={e => { e.stopPropagation(); toggleAmbient(); }}
            className="p-2 bg-zinc-800/60 backdrop-blur-md rounded-full hover:bg-zinc-800 active:scale-95 transition"
            aria-label="Cycle Background Music"
          >
            <Repeat className="w-5 h-5 text-teal-400" />
          </button>

          {/* Now playing label */}
          <span className="text-xs text-teal-300 whitespace-nowrap">{nowPlaying}</span>

          {/* Volume slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-white rounded-lg appearance-none cursor-pointer"
            aria-label="Volume"
          />

          {/* SFX toggle */}
          <button
            onClick={() => setSfxMuted(!sfxMuted)}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle Click SFX"
          >
            {sfxMuted ? '🔇' : '🔊'}
          </button>
        </div>
      )}
    </motion.div>
  );
}
