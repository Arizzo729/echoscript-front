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
    isMuted,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
  } = useSound();

  const trackLabels = ['OFF', 'BG 1', 'BG 2', 'BG 3'];
  const [minimized, setMinimized] = useState(false);
  const [size, setSize] = useState({ width: 280, height: 60 });
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 80 });
  const overlayRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 });

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

  const onMouseDownDrag = (e) => {
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
  };

  const onDrag = (e) => {
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - size.width, newX)),
      y: Math.max(0, Math.min(window.innerHeight - size.height, newY)),
    });
  };

  const stopDrag = () => {
    localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  };

  const onMouseDownResize = (e) => {
    resizeStart.current = {
      width: size.width,
      height: size.height,
      x: e.clientX,
      y: e.clientY,
    };
    window.addEventListener('mousemove', onResize);
    window.addEventListener('mouseup', stopResize);
  };

  const onResize = (e) => {
    const deltaX = e.clientX - resizeStart.current.x;
    const deltaY = e.clientY - resizeStart.current.y;
    setSize({
      width: Math.max(minWidth, Math.min(maxWidth, resizeStart.current.width + deltaX)),
      height: Math.max(minHeight, Math.min(maxHeight, resizeStart.current.height + deltaY))
    });
  };

  const stopResize = () => {
    localStorage.setItem('audio-overlay-width', size.width);
    localStorage.setItem('audio-overlay-height', size.height);
    window.removeEventListener('mousemove', onResize);
    window.removeEventListener('mouseup', stopResize);
  };

  const currentTrack = trackLabels[trackIndex] || 'BG';
  if (typeof window !== 'undefined' && window.__introPlayed === false) return null;

  return (
    <motion.div
      ref={overlayRef}
      onMouseDown={onMouseDownDrag}
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, width: size.width, height: size.height }}
      className={twMerge(
        'fixed z-[9999] px-3 py-2 shadow-lg border border-zinc-700 rounded-lg backdrop-blur-md bg-zinc-900/80 select-none flex items-center justify-between transition-colors duration-200',
        minimized && 'w-8 h-8 justify-center p-0 gap-0'
      )}
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

          <div className="flex items-center gap-3 w-full h-full">
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
              onMouseDown={onMouseDownResize}
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

