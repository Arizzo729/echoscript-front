import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Minus,
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
    playAmbientTrack
  } = useSound();

  const trackLabels = ['OFF', 'BG 1', 'BG 2', 'BG 3'];
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 80 });
  const overlayRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition({ x: saved.x, y: saved.y });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      const clampedX = Math.max(0, Math.min(window.innerWidth - overlayRef.current.offsetWidth, newX));
      const clampedY = Math.max(0, Math.min(window.innerHeight - overlayRef.current.offsetHeight, newY));
      setPosition({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
    };

    const onMouseDown = (e) => {
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    const node = overlayRef.current;
    if (node && !minimized) node.addEventListener('mousedown', onMouseDown);
    return () => node && node.removeEventListener('mousedown', onMouseDown);
  }, [position, minimized]);

  const handlePlayToggle = () => {
    if (trackIndex === 0) {
      playAmbientTrack(1);
    } else {
      togglePlay();
    }
  };

  const handleMinimize = () => {
    const headerMusicIcon = document.getElementById('header-music-icon');
    if (headerMusicIcon) {
      const rect = headerMusicIcon.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
    setMinimized(true);
  };

  const currentTrack = trackLabels[trackIndex] || 'BG';
  if (typeof window !== 'undefined' && window.__introPlayed === false) return null;

  return (
    <AnimatePresence>
      {!minimized && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={twMerge(
            'fixed z-[9999] px-3 py-2 shadow-lg border border-zinc-700 rounded-lg backdrop-blur-md bg-zinc-900/80 select-none flex items-center justify-between transition-colors duration-200'
          )}
        >
          <span
            onClick={handleMinimize}
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
              onClick={handlePlayToggle}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




