// ✅ EchoScript.AI — Final Stable AudioOverlay with Track Cycling and Proper Interactions
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
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
    playAmbientTrack,
    pauseAmbientTrack,
    enableSound,
    isUnlocked,
  } = useSound();

  const [hidden, setHidden] = useState(false);
  const x = useMotionValue(40);
  const y = useMotionValue(80);
  const wrapperRef = useRef(null);

  const isOff = trackIndex === 3;
  const currentTrack = isOff ? 'OFF' : `BG ${trackIndex + 1}`;

  useEffect(() => {
    if (!window.__introPlayed) setHidden(true);
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null) x.set(saved.x);
    if (saved.y != null) y.set(saved.y);
  }, [x, y]);

  const handleDragEnd = (_, info) => {
    const node = wrapperRef.current;
    if (!node) return;
    const maxX = window.innerWidth - node.offsetWidth;
    const maxY = window.innerHeight - node.offsetHeight;
    const clampedX = Math.min(Math.max(0, info.point.x), maxX);
    const clampedY = Math.min(Math.max(0, info.point.y), maxY);
    x.set(clampedX);
    y.set(clampedY);
    localStorage.setItem('audio-overlay-pos', JSON.stringify({ x: clampedX, y: clampedY }));
  };

  const cycleTrack = (direction) => {
    const total = 4;
    let next = trackIndex;
    if (direction === 'next') {
      next = (trackIndex + 1) % total;
    } else {
      next = (trackIndex - 1 + total) % total;
    }
    if (next === 3) {
      pauseAmbientTrack(); // OFF
    } else {
      playAmbientTrack(next);
    }
  };

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    if (!isUnlocked) enableSound();
    if (isOff) {
      playAmbientTrack(0); // OFF → BG1
    } else {
      togglePlay();
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (!isUnlocked) enableSound();
    cycleTrack('next');
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (!isUnlocked) enableSound();
    cycleTrack('prev');
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          ref={wrapperRef}
          drag
          dragMomentum={false}
          dragElastic={0}
          dragPropagation={false}
          style={{ x, y }}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="fixed z-[9999] flex flex-col items-center gap-1 select-none"
          onPointerDown={(e) => {
            const tag = e.target.tagName.toLowerCase();
            if (['button', 'input', 'svg', 'path'].includes(tag)) {
              e.stopPropagation(); // Prevent accidental dragging
            }
          }}
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
            <span className="text-[0.6rem] min-w-[32px] px-2 py-0.5 rounded-full bg-zinc-800/70 text-teal-300 font-mono text-center">
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
              className="w-40 h-1 accent-teal-400 cursor-pointer z-50"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



