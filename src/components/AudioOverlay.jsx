import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Minus,
  GripHorizontal
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

export default function AudioOverlay() {
  const {
    toggleAmbient,
    trackIndex,
    trackNames,
    isMuted,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
  } = useSound();

  const [minimized, setMinimized] = useState(false);
  const [width, setWidth] = useState(280);
  const [height, setHeight] = useState(60);
  const [resizing, setResizing] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 80 });
  const overlayRef = useRef(null);
  const minWidth = 240;
  const maxWidth = 520;
  const minHeight = 40;
  const maxHeight = 120;
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition({ x: saved.x, y: saved.y });
    const savedWidth = localStorage.getItem('audio-overlay-width');
    const savedHeight = localStorage.getItem('audio-overlay-height');
    if (savedWidth) setWidth(parseInt(savedWidth));
    if (savedHeight) setHeight(parseInt(savedHeight));
  }, []);

  const handleDragStart = (e) => {
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    window.addEventListener('pointermove', handleDragging);
    window.addEventListener('pointerup', stopDragging);
  };

  const handleDragging = (e) => {
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    const clampedX = Math.max(0, Math.min(window.innerWidth - width, newX));
    const clampedY = Math.max(0, Math.min(window.innerHeight - height, newY));
    setPosition({ x: clampedX, y: clampedY });
  };

  const stopDragging = () => {
    window.removeEventListener('pointermove', handleDragging);
    window.removeEventListener('pointerup', stopDragging);
    localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;

    const onMove = (ev) => {
      const newWidth = Math.min(Math.max(startWidth + ev.clientX - startX, minWidth), maxWidth);
      const newHeight = Math.min(Math.max(startHeight + ev.clientY - startY, minHeight), maxHeight);
      setWidth(newWidth);
      setHeight(newHeight);
    };

    const onUp = () => {
      setResizing(false);
      localStorage.setItem('audio-overlay-width', width);
      localStorage.setItem('audio-overlay-height', height);
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
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, width, height }}
      className={twMerge(
        'fixed z-[9999] px-3 py-2 shadow-lg border border-zinc-700 rounded-lg backdrop-blur-md bg-zinc-900/80 cursor-default select-none transition-all flex items-center justify-between',
        minimized && 'w-8 h-8 justify-center p-0 gap-0'
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onPointerDown={(e) => {
        if (!resizing && !e.target.closest('button') && !e.target.closest('[title="Resize"]')) {
          handleDragStart(e);
        }
      }}
    >
      {minimized ? (
        <span
          onClick={() => setMinimized(false)}
          className="text-teal-400 hover:text-white bg-transparent cursor-pointer"
          aria-label="Restore Audio Overlay"
        >
          🎵
        </span>
      ) : (
        <>
          <span
            onClick={() => setMinimized(true)}
            className="absolute -top-2 -right-2 text-teal-400 hover:text-white cursor-pointer"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </span>

          <div className="flex items-center gap-2">
            <span
              onClick={prevTrack}
              className="text-teal-400 hover:text-white cursor-pointer"
              aria-label="Previous Track"
            >
              <ChevronLeft className="w-5 h-5" />
            </span>

            <span
              onClick={togglePlay}
              className="text-teal-400 hover:text-white cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </span>

            <span
              onClick={nextTrack}
              className="text-teal-400 hover:text-white cursor-pointer"
              aria-label="Next Track"
            >
              <ChevronRight className="w-5 h-5" />
            </span>

            <span className="text-sm text-zinc-300 truncate max-w-[160px]">
              {currentTrack}
            </span>

            <div
              onMouseDown={handleResizeStart}
              className="cursor-se-resize w-4 h-6 ml-1 text-zinc-500 hover:text-zinc-300"
              title="Resize"
            >
              <GripHorizontal className="w-4 h-4 mx-auto" />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
