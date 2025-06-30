// src/components/AudioOverlay.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
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
  const basePanel = 'bg-zinc-900/70 backdrop-blur-md rounded-full shadow-lg flex items-center space-x-2 text-sm text-white';

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
      animate={{ opacity: 1, scale: 1 }}
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
        <div className={`${basePanel} px-3 py-1 pointer-events-auto`}>
          <div className="relative flex items-center">
            {/* Clean minimize button, positioned absolutely */}
            <button
              onClick={() => setMinimized(true)}
              className="absolute -top-1 -right-1 text-xs text-gray-300 hover:text-white focus:outline-none"
              aria-label="Minimize"
            >
              ✕
            </button>
            <button
              onClick={e => { e.stopPropagation(); toggleAmbient(); }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full font-medium shadow
                ${!isMuted && trackIndex > 0 ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              aria-label="Toggle Ambient"
            >
              <span>🎵</span>
              <span className="whitespace-nowrap">{nowPlaying}</span>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-white rounded-lg appearance-none cursor-pointer ml-2"
              aria-label="Volume"
            />
            <button
              onClick={() => setSfxMuted(!sfxMuted)}
              className="ml-1 text-gray-300 hover:text-white text-sm focus:outline-none"
              aria-label="Toggle Click SFX"
            >
              {sfxMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
