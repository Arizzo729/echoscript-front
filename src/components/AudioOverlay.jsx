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
      setPosition(prev => {
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;
        return {
          x: Math.max(0, Math.min(window.innerWidth - overlayRef.current.offsetWidth, newX)),
          y: Math.max(0, Math.min(window.innerHeight - overlayRef.current.offsetHeight, newY))
        };
      });
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
    if (node) node.addEventListener('mousedown', onMouseDown);
    return () => node && node.removeEventListener('mousedown', onMouseDown);
  }, [position]);

  const handlePlayToggle = () => {
    if (trackIndex === 0) {
      playAmbientTrack(1);
    } else {
      togglePlay();
    }
  };

  const handleMinimize = () => {
    setMinimized(true);
    const headerMusicIcon = document.getElementById('header-music-icon');
    if (headerMusicIcon) {
      const rect = headerMusicIcon.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
  };

  const currentTrack = trackLabels[trackIndex] || 'BG';
  if (typeof window !== 'undefined' && window.__introPlayed === false) return null;

  return (
    <motion.div
      ref={overlayRef}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className={twMerge(
        'fixed z-[9999] px-3 py-2 shadow-lg border border-zinc-700 rounded-lg backdrop-blur-md bg-zinc-900/80 select-none flex items-center justify-between transition-colors duration-200 cursor-move',
        minimized && 'w-8 h-8 justify-center p-0 gap-0'
      )}
    >
      {minimized ? (
        <span
          onClick={() => setMinimized(false)}
          id="header-music-icon"
          className="text-teal-400 hover:text-white bg-transparent cursor-pointer"
          aria-label="Restore Audio Overlay"
        >
          🎵
        </span>
      ) : (
        <>
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
        </>
      )}
    </motion.div>
  );
}



