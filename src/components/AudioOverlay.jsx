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
import Button from './ui/Button';
import { useSound } from '../context/SoundContext';
import useIsMobile from '../hooks/useIsMobile';

const TRACKS = [
  { label: 'OFF' },
  { label: 'BG 1' },
  { label: 'BG 2' },
  { label: 'BG 3' }
];

const OVERLAY_WIDTH = 324;
const OVERLAY_HEIGHT = 44;
const COLLAPSED_HEIGHT = 30;

export default function AudioOverlay({ onClose }) {
  const isMobile = useIsMobile();
  const { trackIndex, isPlaying, volume, setVolume, playAmbientTrack, togglePlay } = useSound();
  const [collapsed, setCollapsed] = useState(() =>
    JSON.parse(localStorage.getItem('audio-overlay-collapsed') || 'false')
  );
  const [busy, setBusy] = useState(false);
  const [showTip, setShowTip] = useState(() =>
    !localStorage.getItem('audio-overlay-tip-dismissed')
  );

  // Desktop overlay position
  const [position, setPosition] = useState(() => {
    if (isMobile) return { x: 0, y: 0 };
    return JSON.parse(localStorage.getItem('audio-overlay-pos') || '{"x":56,"y":96}');
  });
  const wrapperRef = useRef(null);

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem('audio-overlay-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Persist tip dismissed
  useEffect(() => {
    if (!showTip) {
      localStorage.setItem('audio-overlay-tip-dismissed', 'true');
    }
  }, [showTip]);

  // Desktop: save position on drag end
  const handleDragEnd = (_, info) => {
    if (!wrapperRef.current) return;
    const node = wrapperRef.current;
    const maxX = window.innerWidth - node.offsetWidth;
    const maxY = window.innerHeight - node.offsetHeight;
    const clampedX = Math.min(Math.max(0, info.point.x), maxX);
    const clampedY = Math.min(Math.max(0, info.point.y), maxY);
    setPosition({ x: clampedX, y: clampedY });
    localStorage.setItem('audio-overlay-pos', JSON.stringify({ x: clampedX, y: clampedY }));
  };

  // Keyboard controls
  useEffect(() => {
    if (collapsed) return;
    const onKey = e => {
      if (e.code === 'Space') {
        e.preventDefault();
        trackIndex === 0 ? playAmbientTrack(1) : togglePlay();
      }
      if (e.code === 'ArrowRight' && !busy) {
        setBusy(true);
        playAmbientTrack((trackIndex + 1) % TRACKS.length);
        setTimeout(() => setBusy(false), 300);
      }
      if (e.code === 'ArrowLeft' && !busy) {
        setBusy(true);
        playAmbientTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length);
        setTimeout(() => setBusy(false), 300);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [trackIndex, busy, playAmbientTrack, togglePlay, collapsed]);

  const currentLabel = TRACKS[trackIndex]?.label;

  // Collapsed header (desktop)
  const DesktopCollapsed = (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[9999] shadow-lg rounded-full bg-zinc-900/85 border border-teal-400/40 px-3 h-[30px] min-h-0 select-none"
      style={{ width: OVERLAY_WIDTH * 0.62, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => setCollapsed(false)}
    >
      <Music className="w-4 h-4 text-teal-400" />
      <span className="text-teal-200 text-[0.82rem] font-medium tracking-wide">Ambient Audio</span>
      <ChevronDown className="w-3 h-3 text-teal-300 ml-auto" />
    </motion.div>
  );

  // Mobile collapsed FAB
  const MobileCollapsed = (
    <motion.button
      key="mobile-collapsed"
      initial={{ opacity: 0, scale: 0.87 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.87 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed bottom-6 right-4 z-[9999] bg-zinc-900/90 border border-teal-400/40 shadow-lg rounded-full w-14 h-14 flex items-center justify-center"
      onClick={() => setCollapsed(false)}
      aria-label="Show audio controls"
      tabIndex={0}
    >
      <Music className="w-7 h-7 text-teal-400" />
    </motion.button>
  );

  // ** ULTRA-COMPACT DESKTOP SOUNDBAR **
  const OverlayUI = (
    <motion.div
      ref={wrapperRef}
      drag={!isMobile && !collapsed}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      style={
        isMobile || collapsed
          ? {}
          : {
              x: position.x,
              y: position.y,
              width: OVERLAY_WIDTH,
              height: OVERLAY_HEIGHT,
              minHeight: OVERLAY_HEIGHT,
              cursor: 'grab',
              touchAction: 'none',
              userSelect: 'none'
            }
      }
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      className={`fixed ${
        isMobile ? 'bottom-0 left-0 right-0 mx-auto' : 'z-[9999]'
      } flex items-center shadow-xl rounded-full bg-zinc-900/95 border border-teal-400/60 backdrop-blur select-none gap-0`}
      style={{
        boxShadow: '0 4px 28px 0 rgba(0,0,0,0.13)',
        ...(!isMobile && { x: position.x, y: position.y }),
        ...(isMobile && {
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 24,
          width: '95vw',
          maxWidth: 380,
          height: 56,
        }),
      }}
    >
      {/* Prev */}
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
      {/* Play/Pause */}
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
      {/* BG Label */}
      <span className="font-mono text-[0.78rem] text-teal-200 tracking-wider px-2 select-none">
        {currentLabel}
      </span>
      {/* Next */}
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
      {/* Volume */}
      <span className="ml-2">
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
      {/* Collapse */}
      <button
        onClick={() => setCollapsed(true)}
        className="ml-2 flex items-center justify-center p-0 w-6 h-6 rounded-full hover:scale-110 transition"
        aria-label="Collapse"
        tabIndex={0}
        style={{
          background: 'none',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        }}
      >
        <ChevronUp className="w-3.5 h-3.5 text-teal-400" />
      </button>
      {/* Tip (desktop only, not mobile) */}
      {!isMobile && showTip && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-800/90 border border-teal-300/50 text-teal-200 text-xs px-3 py-1 rounded-xl shadow">
          <span>← → to switch, Space to play/pause</span>
          <button
            onClick={() => setShowTip(false)}
            className="ml-1 p-0.5 bg-transparent hover:bg-zinc-700 rounded"
            tabIndex={0}
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </motion.div>
  );

  // --- Render logic ---
  if (isMobile) {
    // MOBILE
    return (
      <AnimatePresence>
        {collapsed ? (
          MobileCollapsed
        ) : (
          OverlayUI
        )}
      </AnimatePresence>
    );
  } else {
    // DESKTOP
    return (
      <AnimatePresence>
        {collapsed ? (
          DesktopCollapsed
        ) : (
          OverlayUI
        )}
      </AnimatePresence>
    );
  }
}


