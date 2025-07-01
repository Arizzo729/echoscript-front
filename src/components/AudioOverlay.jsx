// Enhanced and polished AudioOverlay.jsx
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

  const trackLabels = ['BG 1 - Dreamscape Horizon', 'BG 2 - Midnight Flow', 'BG 3 - Echo Drift', 'OFF'];
  const isOff = trackIndex >= trackLabels.length - 1;

  const [minimized, setMinimized] = useState(false);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [volume, setVolume] = useState(1);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 120 });
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
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          className="fixed z-[9999] flex flex-col justify-center items-center gap-2 px-5 py-4 w-72 rounded-xl border border-zinc-700 bg-zinc-900/90 backdrop-blur-md"
        >
          <button
            id="minimize-btn"
            onClick={handleMinimize}
            className="absolute top-1 right-1 text-zinc-400 hover:text-white"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between w-full">
            <button onClick={prevTrack} className="text-zinc-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button onClick={handlePlayToggle} className="text-zinc-400 hover:text-white">
              {isPlaying && !isOff ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button onClick={nextTrack} className="text-zinc-400 hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full overflow-hidden h-5">
            <div className="animate-marquee whitespace-nowrap text-center text-xs text-teal-400 font-mono">
              {currentTrack}
            </div>
          </div>

          <div className="relative w-full flex items-center justify-center">
            <button
              onClick={() => setVolumeVisible(!volumeVisible)}
              className="text-zinc-400 hover:text-white"
              aria-label="Volume"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
                className="absolute -top-8 w-24 h-1 bg-teal-500 rounded-full cursor-pointer"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




