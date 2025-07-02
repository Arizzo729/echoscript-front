import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import Button from './ui/Button';
import { useSound } from '../context/SoundContext';

export default function AudioOverlay() {
  const {
    trackIndex,
    isPlaying,
    volume,
    setVolume,
    togglePlay,
    nextTrack,
    prevTrack,
    playAmbientTrack,
    enableSound,
    isUnlocked,
  } = useSound();

  const [position, setPosition] = useState({ x: 40, y: 80 });
  const [hidden, setHidden] = useState(false);
  const overlayRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const tracks = [
    'BG 1 — Dreamscape Horizon',
    'BG 2 — Midnight Flow',
    'BG 3 — Echo Drift',
    'OFF',
  ];

  const isOff = trackIndex >= tracks.length - 1;
  const currentTrack = tracks[trackIndex] || 'OFF';

  useEffect(() => {
    if (!window.__introPlayed) setHidden(true);
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition(saved);
  }, []);

  useEffect(() => {
    const node = overlayRef.current;

    const onPointerDown = (e) => {
      if (e.button !== 0 || e.target.closest('button, input')) return;
      dragging.current = true;
      offset.current.x = e.clientX - node.getBoundingClientRect().left;
      offset.current.y = e.clientY - node.getBoundingClientRect().top;
      document.body.style.userSelect = 'none';
    };

    const onPointerMove = (e) => {
      if (!dragging.current) return;

      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;

      const maxX = window.innerWidth - node.offsetWidth;
      const maxY = window.innerHeight - node.offsetHeight;

      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
      });
    };

    const onPointerUp = () => {
      if (dragging.current) {
        dragging.current = false;
        document.body.style.userSelect = '';
        localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
      }
    };

    node.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      node.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [position]);

  const handlePlayToggle = () => {
    if (!isUnlocked) enableSound();
    if (isOff) {
      playAmbientTrack(0);
    } else {
      togglePlay();
    }
  };

  const handleNext = () => {
    if (!isUnlocked) enableSound();
    nextTrack();
  };

  const handlePrev = () => {
    if (!isUnlocked) enableSound();
    prevTrack();
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="fixed z-[9999] flex flex-col items-center gap-1 select-none cursor-grab"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full shadow-md border border-teal-600 bg-gradient-to-br from-zinc-950/90 to-zinc-900/80 backdrop-blur-xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              aria-label="Previous"
              icon={<ChevronLeft className="w-4 h-4 text-teal-400" />}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayToggle}
              aria-label="Play"
              icon={
                isPlaying && !isOff ? (
                  <Pause className="w-4 h-4 text-teal-400" />
                ) : (
                  <Play className="w-4 h-4 text-teal-400" />
                )
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              aria-label="Next"
              icon={<ChevronRight className="w-4 h-4 text-teal-400" />}
            />
            <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-zinc-800/70 text-teal-300 font-mono tracking-wide">
              {currentTrack}
            </span>
          </div>
          <div className="w-full flex justify-center mt-0.5">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-40 h-1 accent-teal-400 cursor-pointer"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



