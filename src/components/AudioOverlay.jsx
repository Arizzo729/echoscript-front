// src/components/AudioOverlay.jsx

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';
import { useSound } from '../context/SoundContext';
import useIsMobile from '../hooks/useIsMobile';

const TRACKS = [
  { label: 'OFF' },
  { label: 'BG 1' },
  { label: 'BG 2' },
  { label: 'BG 3' }
];

const DESKTOP_WIDTH = 330;
const DESKTOP_HEIGHT = 46;
const MOBILE_WIDTH = 260;
const MOBILE_HEIGHT = 54;

// Only the bar (not the icons) is draggable for best UX
export default function AudioOverlay() {
  const isMobile = useIsMobile();
  const {
    trackIndex,
    isPlaying,
    volume,
    setVolume,
    playAmbientTrack,
    togglePlay
  } = useSound();
  const [collapsed, setCollapsed] = useState(() =>
    JSON.parse(localStorage.getItem('audio-overlay-collapsed') || 'false')
  );
  const [busy, setBusy] = useState(false);

  // Desktop position
  const [position, setPosition] = useState(() => {
    if (isMobile) return { x: 0, y: 0 };
    return JSON.parse(localStorage.getItem('audio-overlay-pos') || '{"x":56,"y":96}');
  });
  const wrapperRef = useRef(null);

  // Drag state for desktop
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    localStorage.setItem('audio-overlay-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Mouse drag logic (desktop)
  useEffect(() => {
    if (!dragging) return;
    function onMouseMove(e) {
      const width = DESKTOP_WIDTH;
      const height = DESKTOP_HEIGHT;
      let x = e.clientX - width / 2;
      let y = e.clientY - height / 2;
      x = Math.max(0, Math.min(window.innerWidth - width, x));
      y = Math.max(0, Math.min(window.innerHeight - height, y));
      setPosition({ x, y });
    }
    function onMouseUp() {
      setDragging(false);
      localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, position]);

  const currentLabel = TRACKS[trackIndex]?.label;

  // --- DESKTOP Overlay ---
  const DesktopOverlay = (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 21 }}
      style={{
        width: DESKTOP_WIDTH,
        height: DESKTOP_HEIGHT,
        position: 'fixed',
        zIndex: 9999,
        background: 'rgba(24,24,30,0.98)',
        borderRadius: 16,
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        border: '1.2px solid #14b8a6a6',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '0 10px',
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        left: 0,
        top: 0,
      }}
      // Only bar background is draggable
      onMouseDown={e => {
        if (e.target === wrapperRef.current) setDragging(true);
      }}
    >
      {/* Controls */}
      <button
        tabIndex={0}
        aria-label="Previous"
        onClick={() => {
          if (!busy) {
            setBusy(true);
            playAmbientTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        className="p-0 mx-1 rounded transition focus:outline-none"
        style={{
          width: 28,
          height: 28,
          background: 'none',
          border: 'none'
        }}
      >
        <ChevronLeft className="w-4 h-4 text-teal-400" />
      </button>
      <button
        tabIndex={0}
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={() =>
          trackIndex === 0 ? playAmbientTrack(1) : togglePlay()
        }
        className="p-0 mx-1 rounded transition focus:outline-none"
        style={{
          width: 28,
          height: 28,
          background: 'none',
          border: 'none'
        }}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-teal-400" />
        ) : (
          <Play className="w-4 h-4 text-teal-400" />
        )}
      </button>
      <button
        tabIndex={0}
        aria-label="Next"
        onClick={() => {
          if (!busy) {
            setBusy(true);
            playAmbientTrack((trackIndex + 1) % TRACKS.length);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        className="p-0 mx-1 rounded transition focus:outline-none"
        style={{
          width: 28,
          height: 28,
          background: 'none',
          border: 'none'
        }}
      >
        <ChevronRight className="w-4 h-4 text-teal-400" />
      </button>
      <span className="ml-2 mr-2 font-mono text-[0.80rem] text-teal-200 tracking-wider select-none whitespace-nowrap">
        {currentLabel}
      </span>
      <span>
        {volume === 0 ? (
          <VolumeX className="w-4 h-4 text-zinc-400" />
        ) : (
          <Volume2 className="w-4 h-4 text-teal-400" />
        )}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(volume * 100)}
        onChange={e => setVolume(e.target.value / 100)}
        className="w-20 h-1 accent-teal-400 cursor-pointer mx-1"
        aria-label="Volume"
        style={{ minWidth: 64 }}
      />
      <button
        onClick={() => setCollapsed(true)}
        className="ml-auto flex items-center justify-center p-0 w-7 h-7 rounded-full transition"
        aria-label="Collapse"
        tabIndex={0}
        style={{
          background: 'none',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          marginLeft: 10,
          marginRight: 0
        }}
      >
        <ChevronUp className="w-4 h-4 text-teal-400" />
      </button>
    </motion.div>
  );

  // --- Collapsed bar for desktop ---
  const DesktopCollapsed = (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ type: 'spring', stiffness: 220, damping: 19 }}
      className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center z-[9999] shadow-lg rounded-full bg-zinc-900/85 border border-teal-400/40 px-3 h-[32px] min-h-0 select-none"
      style={{ width: 200, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => setCollapsed(false)}
    >
      <Music className="w-4 h-4 text-teal-400" />
      <span className="text-teal-200 text-[0.8rem] font-medium tracking-wide ml-2">Ambient Audio</span>
      <ChevronDown className="w-3 h-3 text-teal-300 ml-auto" />
    </motion.div>
  );

  // --- MOBILE Overlay ---
  // ... (mobile overlay logic not shown, focus is on desktop here for now)

  if (isMobile) return null; // For now, desktop only in this sample
  return (
    <AnimatePresence>
      {collapsed ? (
        DesktopCollapsed
      ) : (
        DesktopOverlay
      )}
    </AnimatePresence>
  );
}

