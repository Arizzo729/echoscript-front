// src/components/AudioOverlay.jsx

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Pause, Play, X, ChevronUp, ChevronDown, Volume2, VolumeX, Music
} from 'lucide-react';
import Button from './ui/Button';
import { useSound } from '../context/SoundContext';
import useIsMobile from '../hooks/useIsMobile';

const TRACKS = [
  { label: 'OFF' },
  { label: 'BG 1' },
  { label: 'BG 2' },
  { label: 'BG 3' }
];

// ---- ABSOLUTELY STICKY DRAG LOGIC FOR MOBILE ONLY ----
function useStickyTouchDrag({ enabled = true, onDragEnd, initial = { x: 0, y: 0 } }) {
  const [pos, setPos] = useState(initial);
  const overlayRef = useRef(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Only set initial position on mount
  useEffect(() => { setPos(initial); }, [initial.x, initial.y]);

  useEffect(() => {
    if (!enabled) return;
    const node = overlayRef.current;
    if (!node) return;
    // Set starting position
    node.style.left = `${pos.x}px`;
    node.style.top = `${pos.y}px`;

    function onTouchStart(e) {
      if (!enabled) return;
      dragging.current = true;
      const touch = e.touches[0];
      const rect = node.getBoundingClientRect();
      dragOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }

    function onTouchMove(e) {
      if (!dragging.current || !enabled) return;
      const touch = e.touches[0];
      let x = touch.clientX - dragOffset.current.x;
      let y = touch.clientY - dragOffset.current.y;
      // Clamp to viewport
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      x = Math.max(0, Math.min(window.innerWidth - width, x));
      y = Math.max(0, Math.min(window.innerHeight - height - 80, y));
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
    }

    function onTouchEnd() {
      if (!dragging.current) return;
      dragging.current = false;
      // Get the final position from DOM
      const rect = node.getBoundingClientRect();
      setPos({ x: rect.left, y: rect.top });
      onDragEnd && onDragEnd({ x: rect.left, y: rect.top });
    }

    node.addEventListener('touchstart', onTouchStart, { passive: false });
    node.addEventListener('touchmove', onTouchMove, { passive: false });
    node.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
      node.removeEventListener('touchend', onTouchEnd);
    };
  }, [enabled, pos, onDragEnd]);

  // Ensure DOM always matches pos when not dragging
  useEffect(() => {
    const node = overlayRef.current;
    if (!node) return;
    if (!dragging.current) {
      node.style.left = `${pos.x}px`;
      node.style.top = `${pos.y}px`;
    }
  }, [pos]);

  return [overlayRef, pos, setPos];
}

export default function AudioOverlay() {
  const isMobile = useIsMobile();
  const { trackIndex, isPlaying, volume, setVolume, playAmbientTrack, togglePlay } = useSound();
  const [collapsed, setCollapsed] = useState(() =>
    JSON.parse(localStorage.getItem('audio-overlay-collapsed') || 'false')
  );
  const [busy, setBusy] = useState(false);

  // --- MOBILE: use sticky drag ---
  const [dragRef, dragPos, setDragPos] = useStickyTouchDrag({
    enabled: isMobile && !collapsed,
    initial: (() => {
      if (!isMobile) return { x: 0, y: 0 };
      const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
      return {
        x: typeof saved.x === 'number' ? saved.x : window.innerWidth - 260 - 16,
        y: typeof saved.y === 'number' ? saved.y : window.innerHeight - 120,
      };
    })(),
    onDragEnd: pos => {
      localStorage.setItem('audio-overlay-pos', JSON.stringify(pos));
    }
  });

  // Desktop overlay position (unchanged)
  const [position, setPosition] = useState(() => {
    if (isMobile) return { x: 0, y: 0 };
    return JSON.parse(localStorage.getItem('audio-overlay-pos') || '{"x":56,"y":96}');
  });
  const wrapperRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('audio-overlay-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Desktop drag (unchanged)
  const handleDesktopDragEnd = (_, info) => {
    if (!wrapperRef.current) return;
    const node = wrapperRef.current;
    const maxX = window.innerWidth - node.offsetWidth;
    const maxY = window.innerHeight - node.offsetHeight;
    const clampedX = Math.min(Math.max(0, info.point.x), maxX);
    const clampedY = Math.min(Math.max(0, info.point.y), maxY);
    setPosition({ x: clampedX, y: clampedY });
    localStorage.setItem('audio-overlay-pos', JSON.stringify({ x: clampedX, y: clampedY }));
  };

  const currentLabel = TRACKS[trackIndex]?.label;

  // --- MOBILE OVERLAY ---
  const MobileOverlay = (
    <div
      ref={dragRef}
      style={{
        position: 'fixed',
        left: dragPos.x,
        top: dragPos.y,
        zIndex: 9999,
        width: 260,
        height: 60,
        background: 'rgba(24,24,30,0.95)',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.13)',
        border: '1.5px solid #14b8a6a6',
        backdropFilter: 'blur(7px)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 10px 0 8px',
        touchAction: 'none',
        userSelect: 'none'
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Previous"
        onClick={() => {
          if (!busy) {
            setBusy(true);
            playAmbientTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        icon={<ChevronLeft className="w-5 h-5 text-teal-400" />}
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={() =>
          trackIndex === 0 ? playAmbientTrack(1) : togglePlay()
        }
        icon={
          isPlaying ? (
            <Pause className="w-5 h-5 text-teal-400" />
          ) : (
            <Play className="w-5 h-5 text-teal-400" />
          )
        }
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Next"
        onClick={() => {
          if (!busy) {
            setBusy(true);
            playAmbientTrack((trackIndex + 1) % TRACKS.length);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        icon={<ChevronRight className="w-5 h-5 text-teal-400" />}
      />
      <span className="ml-1 mr-1 font-mono text-[0.83rem] text-teal-200 tracking-wider select-none">
        {currentLabel}
      </span>
      <button
        onClick={() => setCollapsed(true)}
        className="ml-auto flex items-center justify-center p-0 w-8 h-8 rounded-full hover:scale-110 transition"
        aria-label="Collapse"
        tabIndex={0}
        style={{
          background: 'none',
          border: 'none',
          outline: 'none',
          boxShadow: 'none'
        }}
      >
        <X className="w-4 h-4 text-teal-400" />
      </button>
    </div>
  );

  // --- Desktop, FAB, Collapsed remain unchanged ---
  const MobileFAB = (
    <motion.button
      key="audio-fab"
      initial={{ opacity: 0, scale: 0.90 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.90 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        position: 'fixed',
        bottom: 82,
        right: 18,
        zIndex: 9999,
        background: 'rgba(24,24,30,0.94)',
        border: '1.5px solid #14b8a6a6',
        boxShadow: '0 2px 14px 0 rgba(0,0,0,0.14)',
        borderRadius: 9999,
        width: 52,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={() => setCollapsed(false)}
      aria-label="Show audio controls"
      tabIndex={0}
    >
      <Music className="w-6 h-6 text-teal-400" />
    </motion.button>
  );

  const DesktopOverlay = (
    <motion.div
      ref={wrapperRef}
      drag={!isMobile && !collapsed}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDesktopDragEnd}
      style={{
        x: position.x,
        y: position.y,
        width: 324,
        height: 44,
        minHeight: 44,
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        background: 'rgba(24,24,30,0.98)',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.13)',
        border: '1.5px solid #14b8a6a6',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: '0 10px'
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
    >
      <Button
        variant="ghost"
        size="sm"
        aria-label="Previous"
        onClick={() => {
          if (!busy) {
            setBusy(true);
            playAmbientTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        className="px-1"
        icon={<ChevronLeft className="w-4 h-4 text-teal-400" />}
      />
      <Button
        variant="ghost"
        size="sm"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={() =>
          trackIndex === 0 ? playAmbientTrack(1) : togglePlay()
        }
        className="px-1"
        icon={
          isPlaying ? (
            <Pause className="w-4 h-4 text-teal-400" />
          ) : (
            <Play className="w-4 h-4 text-teal-400" />
          )
        }
      />
      <Button
        variant="ghost"
        size="sm"
        aria-label="Next"
        onClick={() => {
          if (!busy) {
            setBusy(true);
            playAmbientTrack((trackIndex + 1) % TRACKS.length);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        className="px-1"
        icon={<ChevronRight className="w-4 h-4 text-teal-400" />}
      />
      <span className="ml-1 mr-1 font-mono text-[0.80rem] text-teal-200 tracking-wider select-none">
        {currentLabel}
      </span>
      <span>
        {volume === 0 ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
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
        className="ml-auto flex items-center justify-center p-0 w-7 h-7 rounded-full hover:scale-110 transition"
        aria-label="Collapse"
        tabIndex={0}
        style={{
          background: 'none',
          border: 'none',
          outline: 'none',
          boxShadow: 'none'
        }}
      >
        <ChevronUp className="w-4 h-4 text-teal-400" />
      </button>
    </motion.div>
  );

  const DesktopCollapsed = (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[9999] shadow-lg rounded-full bg-zinc-900/85 border border-teal-400/40 px-3 h-[30px] min-h-0 select-none"
      style={{ width: 200, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => setCollapsed(false)}
    >
      <Music className="w-4 h-4 text-teal-400" />
      <span className="text-teal-200 text-[0.8rem] font-medium tracking-wide">Ambient Audio</span>
      <ChevronDown className="w-3 h-3 text-teal-300 ml-auto" />
    </motion.div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {collapsed ? (
          MobileFAB
        ) : (
          MobileOverlay
        )}
      </AnimatePresence>
    );
  } else {
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
}
