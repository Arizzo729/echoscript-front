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
import Button from './ui/Button';
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

// --- Touch drag for mobile (NO LAG) ---
function useTouchDrag({ enabled, initial = { x: 0, y: 0 }, onDragEnd }) {
  const [pos, setPos] = useState(initial);
  const nodeRef = useRef(null);

  useEffect(() => {
    setPos(initial);
  }, [initial.x, initial.y]);

  useEffect(() => {
    if (!enabled) return;
    const node = nodeRef.current;
    if (!node) return;

    let startX, startY, startLeft, startTop;
    function onTouchStart(e) {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startLeft = pos.x;
      startTop = pos.y;
      node.style.transition = 'none';
    }
    function onTouchMove(e) {
      const touch = e.touches[0];
      let newX = startLeft + (touch.clientX - startX);
      let newY = startTop + (touch.clientY - startY);

      // Clamp to window
      const width = MOBILE_WIDTH;
      const height = MOBILE_HEIGHT;
      newX = Math.max(0, Math.min(window.innerWidth - width, newX));
      newY = Math.max(0, Math.min(window.innerHeight - height - 14, newY));
      setPos({ x: newX, y: newY });
      node.style.left = `${newX}px`;
      node.style.top = `${newY}px`;
    }
    function onTouchEnd() {
      node.style.transition = '';
      onDragEnd && onDragEnd(pos);
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

  return [nodeRef, pos, setPos];
}

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

  // --- Desktop overlay position ---
  const [position, setPosition] = useState(() => {
    if (isMobile) return { x: 0, y: 0 };
    return JSON.parse(localStorage.getItem('audio-overlay-pos') || '{"x":56,"y":96}');
  });
  const wrapperRef = useRef(null);

  // --- Mobile touch drag state ---
  const [dragRef, dragPos, setDragPos] = useTouchDrag({
    enabled: isMobile && !collapsed,
    initial: (() => {
      if (!isMobile) return { x: 0, y: 0 };
      const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
      return {
        x: typeof saved.x === 'number' ? saved.x : window.innerWidth - MOBILE_WIDTH - 20,
        y: typeof saved.y === 'number' ? saved.y : window.innerHeight - MOBILE_HEIGHT - 90,
      };
    })(),
    onDragEnd: pos => {
      localStorage.setItem('audio-overlay-pos', JSON.stringify(pos));
    }
  });

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem('audio-overlay-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Desktop drag (framer-motion)
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

  // --- DESKTOP Overlay ---
  const DesktopOverlay = (
    <motion.div
      ref={wrapperRef}
      drag={!isMobile && !collapsed}
      dragMomentum={false}
      dragElastic={0}
      dragListener={false}
      onMouseDown={e => {
        if (e.target === wrapperRef.current) {
          wrapperRef.current?.setPointerCapture(e.pointerId);
        }
      }}
      onDragEnd={handleDesktopDragEnd}
      style={{
        x: position.x,
        y: position.y,
        width: DESKTOP_WIDTH,
        height: DESKTOP_HEIGHT,
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        background: 'rgba(24,24,30,0.98)',
        borderRadius: 16,
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        border: '1.2px solid #14b8a6a6',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '0 10px'
      }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 21 }}
      onPointerDown={e => {
        // Only drag if not on a button
        if (e.target === wrapperRef.current) wrapperRef.current.setPointerCapture(e.pointerId);
      }}
    >
      {/* Drag area */}
      <div
        className="absolute left-0 top-0 w-full h-full rounded-[16px] z-0 cursor-grab"
        style={{ pointerEvents: 'auto' }}
        onPointerDown={e => {
          if (e.target === wrapperRef.current) wrapperRef.current.setPointerCapture(e.pointerId);
        }}
      ></div>
      {/* Controls */}
      <div className="flex flex-1 items-center relative z-10">
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
          className="p-1 mx-1 rounded hover:bg-teal-900/10 transition focus:outline-none"
          style={{ width: 28, height: 28 }}
        >
          <ChevronLeft className="w-4 h-4 text-teal-400" />
        </button>
        <button
          tabIndex={0}
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={() =>
            trackIndex === 0 ? playAmbientTrack(1) : togglePlay()
          }
          className="p-1 mx-1 rounded hover:bg-teal-900/10 transition focus:outline-none"
          style={{ width: 28, height: 28 }}
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
          className="p-1 mx-1 rounded hover:bg-teal-900/10 transition focus:outline-none"
          style={{ width: 28, height: 28 }}
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
      </div>
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
  const MobileOverlay = (
    <motion.div
      ref={dragRef}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: dragPos.x,
        y: dragPos.y
      }}
      exit={{ opacity: 0, scale: 0.96 }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 9999,
        width: MOBILE_WIDTH,
        height: MOBILE_HEIGHT,
        background: 'rgba(24,24,30,0.98)',
        borderRadius: 15,
        boxShadow: '0 3px 18px 0 rgba(0,0,0,0.13)',
        border: '1.2px solid #14b8a6a6',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '0 8px',
        touchAction: 'none',
        userSelect: 'none'
      }}
    >
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
        className="p-1 mx-0 rounded hover:bg-teal-900/10 transition focus:outline-none"
        style={{ width: 28, height: 28 }}
      >
        <ChevronLeft className="w-5 h-5 text-teal-400" />
      </button>
      <button
        tabIndex={0}
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={() =>
          trackIndex === 0 ? playAmbientTrack(1) : togglePlay()
        }
        className="p-1 mx-0 rounded hover:bg-teal-900/10 transition focus:outline-none"
        style={{ width: 28, height: 28 }}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-teal-400" />
        ) : (
          <Play className="w-5 h-5 text-teal-400" />
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
        className="p-1 mx-0 rounded hover:bg-teal-900/10 transition focus:outline-none"
        style={{ width: 28, height: 28 }}
      >
        <ChevronRight className="w-5 h-5 text-teal-400" />
      </button>
      <span className="ml-2 mr-1 font-mono text-[0.80rem] text-teal-200 tracking-wider select-none whitespace-nowrap">
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
        <X className="w-5 h-5 text-teal-400" />
      </button>
    </motion.div>
  );

  // --- FAB for mobile ---
  const MobileFAB = (
    <motion.button
      key="audio-fab"
      initial={{ opacity: 0, scale: 0.90 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.90 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        position: 'fixed',
        // Move FAB up above mobile nav bar
        bottom: 90,
        right: 18,
        zIndex: 9999,
        background: 'rgba(24,24,30,0.94)',
        border: '1.5px solid #14b8a6a6',
        boxShadow: '0 2px 14px 0 rgba(0,0,0,0.14)',
        borderRadius: 9999,
        width: 48,
        height: 48,
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

  // --- Render logic ---
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
