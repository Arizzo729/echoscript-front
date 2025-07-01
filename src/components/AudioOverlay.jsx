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
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition({ x: saved.x, y: saved.y });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      const clampedX = Math.max(0, Math.min(window.innerWidth - overlayRef.current.offsetWidth, newX));
      const clampedY = Math.max(0, Math.min(window.innerHeight - overlayRef.current.offsetHeight, newY));
      setPosition({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
    };

    const node = overlayRef.current;
    if (!minimized && node) {
      const handleMouseDown = (e) => {
        // Only start drag if not clicking the minimize button
        const isClickInsideMinimize = e.target.closest('#minimize-btn');
        if (isClickInsideMinimize) return;

        isDragging.current = true;
        dragOffset.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      };
      node.addEventListener('mousedown', handleMouseDown);
      return () => node.removeEventListener('mousedown', handleMouseDown);
    }
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
          transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
          className={twMerge(
            'fixed z-[9999] px-4 py-3 shadow-lg border border-zinc-700 rounded-lg backdrop-blur-md bg-zinc-900/80 select-none flex items-center justify-between transition-colors duration-200 cursor-default'
          )}
        >
          <span
            id="minimize-btn"
            onClick={handleMinimize}
            className="absolute top-1 right-1 text-teal-400 hover:text-white cursor-pointer"
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




