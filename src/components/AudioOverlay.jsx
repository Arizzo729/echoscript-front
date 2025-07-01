import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Repeat, SkipBack, SkipForward, Minus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

export default function AudioOverlay() {
  const { toggleAmbient, trackIndex, isMuted } = useSound();
  const [minimized, setMinimized] = useState(false);
  const [size, setSize] = useState({ width: 220, height: 44 });
  const x = useMotionValue(20);
  const y = useMotionValue(window.innerHeight - 100);
  const ref = useRef(null);
  const resizeRef = useRef(null);

  // Restore previous position and size
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-state') || '{}');
    if (saved.x != null && saved.y != null) {
      x.set(saved.x);
      y.set(saved.y);
    }
    if (saved.width && saved.height) {
      setSize({ width: saved.width, height: saved.height });
    }
  }, [x, y]);

  // Save position on drag end
  const handleDragEnd = (_, info) => {
    const snapX = Math.max(0, Math.min(window.innerWidth - size.width, info.point.x));
    const snapY = Math.max(0, Math.min(window.innerHeight - size.height, info.point.y));
    x.set(snapX);
    y.set(snapY);
    localStorage.setItem('audio-overlay-state', JSON.stringify({ x: snapX, y: snapY, ...size }));
  };

  // Resize logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      setSize(prev => {
        const newWidth = Math.min(Math.max(180, e.clientX - ref.current.offsetLeft), 400);
        const newHeight = Math.min(Math.max(36, e.clientY - ref.current.offsetTop), 100);
        return { width: newWidth, height: newHeight };
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    const startResizing = () => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    const node = resizeRef.current;
    if (node) node.addEventListener('mousedown', startResizing);
    return () => node?.removeEventListener('mousedown', startResizing);
  }, []);

  const isActive = !isMuted && trackIndex > 0;

  return (
    <motion.div
      ref={ref}
      drag
      dragMomentum={false}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      style={{ x, y, width: size.width, height: size.height }}
      className={twMerge(
        'fixed z-[9999] border border-zinc-700 bg-zinc-900/80 text-white rounded-xl backdrop-blur flex items-center justify-between px-3 py-1 shadow-xl transition-all',
        minimized && 'w-10 h-10 justify-center px-0 py-0'
      )}
    >
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="text-white hover:text-teal-400 text-lg"
          aria-label="Restore"
        >
          🎵
        </button>
      ) : (
        <>
          <button
            onClick={() => setMinimized(true)}
            className="absolute top-1 right-2 text-zinc-400 hover:text-white"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 ml-2">
            <button className="text-zinc-300 hover:text-teal-400">
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => toggleAmbient()}
              className={twMerge(
                'transition-colors',
                isActive ? 'text-teal-400 hover:text-teal-300' : 'text-zinc-400 hover:text-white'
              )}
              aria-label="Cycle"
            >
              <Repeat className="w-5 h-5" />
            </button>

            <button className="text-zinc-300 hover:text-teal-400">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <span className="ml-4 text-sm text-zinc-300">
            {isMuted ? 'Muted' : `Track ${trackIndex || 'Off'}`}
          </span>

          <div
            ref={resizeRef}
            className="absolute bottom-1 right-1 w-3 h-3 cursor-nwse-resize bg-transparent"
          />
        </>
      )}
    </motion.div>
  );
}


