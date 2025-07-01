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

  const trackLabels = ['BG 1', 'BG 2', 'BG 3', 'OFF'];
  const isOff = trackIndex >= trackLabels.length - 1;

  const [minimized, setMinimized] = useState(false);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [volume, setVolume] = useState(1);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [hidden, setHidden] = useState(false);

  const overlayRef = useRef(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // ✅ Hide during intro
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__introPlayed) {
      setHidden(true);
    }
  }, []);

  // Load saved position
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition(saved);
  }, []);

  // Drag logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      const maxX = window.innerWidth - overlayRef.current.offsetWidth;
      const maxY = window.innerHeight - overlayRef.current.offsetHeight;

      requestAnimationFrame(() => {
        setPosition({
          x: Math.min(Math.max(0, newX), maxX),
          y: Math.min(Math.max(0, newY), maxY),
        });
      });
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
        if (
          e.target.closest('#minimize-btn') ||
          e.target.closest('#volume-wrapper') ||
          e.button !== 0
        )
          return;

        const bounds = node.getBoundingClientRect();
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

  // ✅ Play or start BG 1 if OFF
  const handlePlayToggle = () => {
    if (isOff) {
      playAmbientTrack(0); // Start BG 1
    } else {
      togglePlay();
    }
  };

  // ✅ Minimize logic
  const handleMinimize = () => {
    const icon = document.getElementById('header-music-icon');
    if (icon) {
      const rect = icon.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
    setMinimized(true);
  };

  const currentTrack = isOff ? 'OFF' : trackLabels[trackIndex];

  return (
    <AnimatePresence>
      {!minimized && !hidden && (
        <motion.div
          ref={overlayRef}
          id="audio-overlay"
          data-minimized="false"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          className={twMerge(
            'fixed z-[9999] flex items-center gap-4 px-5 py-3 rounded-full shadow-xl border border-zinc-700 bg-zinc-900/90 backdrop-blur-md cursor-default select-none'
          )}
        >
          {/* Minimize Button */}
          <button
            id="minimize-btn"
            onClick={handleMinimize}
            className="absolute -top-2 -right-2 text-zinc-400 hover:text-white p-1"
            aria-label="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Previous */}
          <button
            onClick={prevTrack}
            className="text-teal-400 hover:text-white focus:outline-none bg-transparent"
            aria-label="Previous Track"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayToggle}
            className="text-teal-400 hover:text-white focus:outline-none bg-transparent"
            aria-label="Play or Pause"
          >
            {isPlaying && !isOff ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            className="text-teal-400 hover:text-white focus:outline-none bg-transparent"
            aria-label="Next Track"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Track Label */}
          <span className="text-xs text-zinc-300 font-medium min-w-[50px] max-w-[80px] truncate text-center">
            {currentTrack}
          </span>

          {/* Volume */}
          <div
            id="volume-wrapper"
            className="relative"
            onMouseLeave={() => setVolumeVisible(false)}
          >
            <button
              onClick={() => setVolumeVisible(!volumeVisible)}
              className="text-teal-400 hover:text-white focus:outline-none bg-transparent"
              aria-label="Volume"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {volumeVisible && (
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
                className="absolute -top-9 left-1/2 -translate-x-1/2 w-24 h-1 bg-teal-500 rounded-full cursor-pointer"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




