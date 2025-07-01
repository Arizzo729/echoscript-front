import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Minus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

export default function AudioOverlay() {
  const {
    trackIndex,
    isMuted,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    playAmbientTrack,
    setMuted,
  } = useSound();

  const trackLabels = ['OFF', 'BG 1', 'BG 2', 'BG 3'];
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 90 });
  const [volume, setVolume] = useState(1);
  const overlayRef = useRef(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition(saved);
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
        if (e.target.closest('#minimize-btn') || e.target.closest('#volume-control')) return;

        const bounds = overlayRef.current.getBoundingClientRect();
        dragOffset.current = {
          x: e.clientX - bounds.left,
          y: e.clientY - bounds.top,
        };
        isDragging.current = true;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      };

      node.addEventListener('mousedown', handleMouseDown);
      return () => node.removeEventListener('mousedown', handleMouseDown);
    }
  }, [position, minimized]);

  const handlePlayToggle = () => {
    if (trackIndex === 0) playAmbientTrack(1);
    else togglePlay();
  };

  const handleMinimize = () => {
    const icon = document.getElementById('header-music-icon');
    if (icon) {
      const rect = icon.getBoundingClientRect();
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
            'fixed z-[9999] flex items-center gap-4 px-5 py-2 rounded-full shadow-lg border border-zinc-700 bg-zinc-900/80 backdrop-blur-md cursor-default select-none'
          )}
        >
          <span
            onClick={prevTrack}
            className="text-teal-400 hover:text-white cursor-pointer"
            aria-label="Previous Track"
          >
            <ChevronLeft className="w-4 h-4" />
          </span>

          <span
            onClick={handlePlayToggle}
            className="text-teal-400 hover:text-white cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </span>

          <span
            onClick={nextTrack}
            className="text-teal-400 hover:text-white cursor-pointer"
            aria-label="Next Track"
          >
            <ChevronRight className="w-4 h-4" />
          </span>

          <span className="text-xs text-zinc-300 truncate max-w-[100px]">{currentTrack}</span>

          <div id="volume-control" className="relative group">
            <button
              onClick={() => setMuted(!isMuted)}
              className="text-teal-400 hover:text-white"
              aria-label="Mute Toggle"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                setMuted(val === 0);
              }}
              className="absolute hidden group-hover:block -top-8 left-1/2 -translate-x-1/2 w-24 h-1 bg-teal-500 rounded-full cursor-pointer"
            />
          </div>

          <span
            id="minimize-btn"
            onClick={handleMinimize}
            className="text-teal-400 hover:text-white cursor-pointer"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



