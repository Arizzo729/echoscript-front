import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Minus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

/**
 * AudioOverlay — Seamless resizable, draggable, on-theme ambient music controller
 */
export default function AudioOverlay() {
  const { toggleAmbient, trackIndex, trackNames, isMuted, isPlaying, togglePlay, nextTrack, prevTrack } = useSound();
  const [minimized, setMinimized] = useState(false);
  const [width, setWidth] = useState(280);
  const [resizing, setResizing] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 80 });
  const overlayRef = useRef(null);
  const minWidth = 240;
  const maxWidth = 520;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition({ x: saved.x, y: saved.y });
    const savedWidth = localStorage.getItem('audio-overlay-width');
    if (savedWidth) setWidth(parseInt(savedWidth));
  }, []);

  const handlePointerDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...position };

    const onMove = (ev) => {
      const newX = startPos.x + (ev.clientX - startX);
      const newY = startPos.y + (ev.clientY - startY);
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - width, newX)),
        y: Math.max(0, Math.min(window.innerHeight - 60, newY))
      });
    };

    const onUp = () => {
      localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    setResizing(true);
    const startX = e.clientX;
    const startWidth = width;

    const onMove = (ev) => {
      const newWidth = Math.min(Math.max(startWidth + ev.clientX - startX, minWidth), maxWidth);
      setWidth(newWidth);
    };

    const onUp = () => {
      setResizing(false);
      localStorage.setItem('audio-overlay-width', width);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const currentTrack = trackNames?.[trackIndex] || 'Ambient Track';

  return (
    <motion.div
      ref={overlayRef}
      style={{ x: position.x, y: position.y, width }}
      className={twMerge(
        'fixed z-[9999] p-2 flex items-center gap-3 shadow-xl border border-zinc-700 rounded-lg backdrop-blur-lg bg-zinc-900/70 transition-all cursor-default',
        minimized && 'w-8 h-8 justify-center p-0'
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onPointerDown={(e) => {
        if (!resizing && !e.target.closest('button') && !e.target.closest('[title="Resize"]')) {
          handlePointerDown(e);
        }
      }}
    >
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="text-teal-400 hover:text-white"
          aria-label="Restore Audio Overlay"
        >
          🎵
        </button>
      ) : (
        <>
          <button
            onClick={() => setMinimized(true)}
            className="absolute -top-2 -right-2 text-teal-400 text-sm hover:text-white"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={prevTrack}
            className="text-teal-300 hover:text-white"
            aria-label="Previous Track"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="text-teal-300 hover:text-white"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={nextTrack}
            className="text-teal-300 hover:text-white"
            aria-label="Next Track"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <span className="text-sm text-zinc-300 truncate max-w-[160px]">
            {currentTrack}
          </span>

          <div
            onMouseDown={handleResizeStart}
            className="cursor-ew-resize w-2 h-6 ml-2 bg-transparent"
            title="Resize"
          />
        </>
      )}
    </motion.div>
  );
}




