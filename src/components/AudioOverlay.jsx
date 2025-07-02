import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Pause, Play, Minus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import Button from './ui/Button';

export default function AudioOverlay() {
  const {
    trackIndex, isMuted, isPlaying,
    togglePlay, nextTrack, prevTrack,
    playAmbientTrack,
  } = useSound();

  const trackLabels = [
    'BG 1 — Dreamscape Horizon',
    'BG 2 — Midnight Flow',
    'BG 3 — Echo Drift',
    'OFF',
  ];

  const isOff = trackIndex >= trackLabels.length - 1;
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 40, y: 80 });
  const [hidden, setHidden] = useState(false);
  const overlayRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.__introPlayed) setHidden(true);
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition(saved);
  }, []);

  useEffect(() => {
    const node = overlayRef.current;
    const onMouseMove = (e) => {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      const maxX = window.innerWidth - node.offsetWidth;
      const maxY = window.innerHeight - node.offsetHeight;
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
    };

    const onMouseDown = (e) => {
      if (e.button !== 0 || e.target.closest('button, input')) return;
      const bounds = node.getBoundingClientRect();
      dragOffset.current.x = e.clientX - bounds.left;
      dragOffset.current.y = e.clientY - bounds.top;
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    if (node && !minimized) node.addEventListener('mousedown', onMouseDown);
    return () => node?.removeEventListener('mousedown', onMouseDown);
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
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="fixed z-[9999] flex items-center gap-3 px-4 py-2 rounded-full shadow-md border border-teal-600 bg-gradient-to-br from-zinc-950/90 to-zinc-900/80 backdrop-blur-xl cursor-move"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={prevTrack}
            aria-label="Previous"
            icon={<ChevronLeft className="w-4 h-4 text-teal-400" />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayToggle}
            aria-label="Play"
            icon={
              isPlaying && !isOff
                ? <Pause className="w-4 h-4 text-teal-400" />
                : <Play className="w-4 h-4 text-teal-400" />
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={nextTrack}
            aria-label="Next"
            icon={<ChevronRight className="w-4 h-4 text-teal-400" />}
          />

          <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-zinc-800/70 text-teal-300 font-mono tracking-wide">
            {currentTrack}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimize}
            aria-label="Minimize"
            icon={
              <span className="text-teal-400 text-sm leading-none -mb-1">_</span>
            }
            className="ml-2"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}







