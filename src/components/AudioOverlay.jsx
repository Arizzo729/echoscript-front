import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Minus
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
  const [size, setSize] = useState({ width: 280, height: 60 });
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 80 });
  const overlayRef = useRef(null);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeOrigin = useRef({ width: 0, height: 0, x: 0, y: 0 });

  const minWidth = 200;
  const maxWidth = 520;
  const minHeight = 40;
  const maxHeight = 120;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition({ x: saved.x, y: saved.y });
    const savedWidth = localStorage.getItem('audio-overlay-width');
    const savedHeight = localStorage.getItem('audio-overlay-height');
    if (savedWidth) setSize((s) => ({ ...s, width: parseInt(savedWidth) }));
    if (savedHeight) setSize((s) => ({ ...s, height: parseInt(savedHeight) }));
  }, []);

  const handlePointerDown = (e) => {
    if (!e.target.closest('[data-resize-handle]')) {
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      window.addEventListener('pointermove', handleDragging);
      window.addEventListener('pointerup', stopDragging);
    }
  };

  const handleDragging = (e) => {
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - size.width, newX)),
      y: Math.max(0, Math.min(window.innerHeight - size.height, newY)),
    });
  };

  const stopDragging = () => {
    window.removeEventListener('pointermove', handleDragging);
    window.removeEventListener('pointerup', stopDragging);
    localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
  };

  const handleResizeStart = (e) => {
    isResizing.current = true;
    resizeOrigin.current = {
      width: size.width,
      height: size.height,
      x: e.clientX,
      y: e.clientY,
    };
    window.addEventListener('pointermove', handleResize);
    window.addEventListener('pointerup', stopResize);
  };

  const handleResize = (e) => {
    if (!isResizing.current) return;
    const deltaX = e.clientX - resizeOrigin.current.x;
    const deltaY = e.clientY - resizeOrigin.current.y;
    setSize({
      width: Math.max(minWidth, Math.min(maxWidth, resizeOrigin.current.width + deltaX)),
      height: Math.max(minHeight, Math.min(maxHeight, resizeOrigin.current.height + deltaY)),
    });
  };

  const stopResize = () => {
    isResizing.current = false;
    window.removeEventListener('pointermove', handleResize);
    window.removeEventListener('pointerup', stopResize);
    localStorage.setItem('audio-overlay-width', size.width);
    localStorage.setItem('audio-overlay-height', size.height);
  };

  const currentTrack = trackNames?.[trackIndex] || 'Ambient Track';

  return (
    <motion.div
      ref={overlayRef}
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, ...size }}
      className={twMerge(
        'fixed z-[9999] px-3 py-2 shadow-lg border border-zinc-700 rounded-lg backdrop-blur-md bg-zinc-900/80 cursor-default select-none transition-all flex items-center justify-between',
        minimized && 'w-8 h-8 justify-center p-0 gap-0'
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onPointerDown={handlePointerDown}
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

          <div className="flex items-center gap-3 w-full">
            <span
              onClick={prevTrack}
              role="button"
              className="text-teal-400 hover:text-white cursor-pointer"
              aria-label="Previous Track"
            >
              <ChevronLeft className="w-5 h-5" />
            </span>

            <span
              onClick={togglePlay}
              role="button"
              className="text-teal-400 hover:text-white cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </span>

            <span
              onClick={nextTrack}
              role="button"
              className="text-teal-400 hover:text-white cursor-pointer"
              aria-label="Next Track"
            >
              <ChevronRight className="w-5 h-5" />
            </span>

            <span className="text-sm text-zinc-300 truncate max-w-[180px]">
              {currentTrack}
            </span>

            <div
              onPointerDown={handleResizeStart}
              data-resize-handle
              className="cursor-se-resize w-4 h-6 ml-auto text-zinc-500 hover:text-zinc-300"
              title="Resize"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mx-auto"
              >
                <path d="M15 3h6v6" />
                <path d="M21 3L14 10" />
              </svg>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
