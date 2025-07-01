import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Minus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const trackLabels = [
    'BG 1 — Dreamscape Horizon',
    'BG 2 — Midnight Flow',
    'BG 3 — Echo Drift',
    'OFF',
  ];
  const isOff = trackIndex >= trackLabels.length - 1;
  const [minimized, setMinimized] = useState(false);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [volume, setVolume] = useState(1);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [hidden, setHidden] = useState(false);

  const overlayRef = useRef(null);
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    if (!window.__introPlayed) setHidden(true);
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition(saved);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragRef.current.dragging) return;
      const newX = e.clientX - dragRef.current.offsetX;
      const newY = e.clientY - dragRef.current.offsetY;
      const maxX = window.innerWidth - overlayRef.current.offsetWidth;
      const maxY = window.innerHeight - overlayRef.current.offsetHeight;
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
      });
    };
    const handleMouseUp = () => {
      dragRef.current.dragging = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
    };
    const node = overlayRef.current;
    const handleMouseDown = (e) => {
      if (e.button !== 0 || e.target.closest('button, input')) return;
      const bounds = node.getBoundingClientRect();
      dragRef.current.dragging = true;
      dragRef.current.offsetX = e.clientX - bounds.left;
      dragRef.current.offsetY = e.clientY - bounds.top;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };
    if (node && !minimized) node.addEventListener('mousedown', handleMouseDown);
    return () => node?.removeEventListener('mousedown', handleMouseDown);
  }, [position, minimized]);

  const handlePlayToggle = () => (isOff ? playAmbientTrack(0) : togglePlay());
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="fixed z-[9999] w-72 rounded-xl shadow-lg border border-zinc-700 bg-zinc-900/90 backdrop-blur-md px-4 py-3 flex flex-col items-center space-y-3"
        >
          {/* Minimize Button */}
          <button
            onClick={handleMinimize}
            className="absolute top-2 right-2 text-zinc-500 hover:text-white"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-5">
            <button onClick={prevTrack} className="text-teal-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handlePlayToggle} className="text-teal-400 hover:text-white">
              {isPlaying && !isOff ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <button onClick={nextTrack} className="text-teal-400 hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Track Name */}
          <div className="w-full h-5 overflow-hidden text-center">
            <div className="whitespace-nowrap animate-scroll text-xs text-teal-300 font-mono">
              {currentTrack}
            </div>
          </div>

          {/* Volume Control */}
          <div className="relative flex items-center justify-center w-full">
            <button
              onClick={() => setVolumeVisible(!volumeVisible)}
              className="text-teal-400 hover:text-white"
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
                className="absolute -top-8 w-28 h-1 accent-teal-400 rounded-full"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




