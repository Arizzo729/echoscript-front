// src/components/AudioOverlay.jsx

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, X, ChevronUp, ChevronDown, Volume2, VolumeX, Music } from 'lucide-react';
import Button from './ui/Button';
import { useSound } from '../context/SoundContext';
import useIsMobile from '../hooks/useIsMobile';

const TRACKS = [
  { label: 'OFF' },
  { label: 'BG 1' },
  { label: 'BG 2' },
  { label: 'BG 3' }
];

// Overlay size constants
const OVERLAY_WIDTH = 320;
const OVERLAY_HEIGHT = 64;
const COLLAPSED_HEIGHT = 36;

export default function AudioOverlay() {
  const isMobile = useIsMobile();
  const { trackIndex, isPlaying, volume, setVolume, playAmbientTrack, togglePlay } = useSound();
  const [collapsed, setCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem('audio-overlay-collapsed') || 'false');
  });
  const [busy, setBusy] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(true);
  const [showTip, setShowTip] = useState(() => {
    return !localStorage.getItem('audio-overlay-tip-dismissed');
  });

  // Position state (only for desktop)
  const [position, setPosition] = useState(() => {
    if (isMobile) return { x: 0, y: 0 };
    return JSON.parse(localStorage.getItem('audio-overlay-pos') || '{"x":48,"y":96}');
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

  // Drag logic (desktop only)
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

  // Mobile: drag logic is not practical; allow swipe-to-close, tap to move to safe spot
  // Or, just keep the floating button on bottom-right when collapsed

  // Keyboard controls
  useEffect(() => {
    const onKey = e => {
      if (collapsed) return;
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
      className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[9999] shadow-lg rounded-full bg-zinc-900/85 border border-teal-400/40 px-3 py-1 select-none"
      style={{ width: OVERLAY_WIDTH * 0.6, height: COLLAPSED_HEIGHT, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => setCollapsed(false)}
    >
      <Music className="w-5 h-5 text-teal-400" />
      <span className="text-teal-200 text-[0.8rem] font-medium tracking-wide">Ambient Audio</span>
      <ChevronDown className="w-4 h-4 text-zinc-400 ml-auto" />
    </motion.div>
  );

  // Collapsed mobile (floating FAB)
  const MobileCollapsed = (
    <motion.button
      key="mobile-collapsed"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed bottom-6 right-4 z-[9999] bg-zinc-900/85 border border-teal-400/40 shadow-xl rounded-full p-3 flex items-center justify-center"
      style={{ width: 48, height: 48 }}
      onClick={() => setCollapsed(false)}
      aria-label="Show audio controls"
    >
      <Music className="w-6 h-6 text-teal-400" />
    </motion.button>
  );

  // Main overlay UI
  const OverlayUI = (
    <motion.div
      ref={wrapperRef}
      drag={!isMobile && !collapsed}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      dragConstraints={isMobile ? false : undefined}
      style={
        isMobile || collapsed
          ? {}
          : {
              x: position.x,
              y: position.y,
              width: OVERLAY_WIDTH,
              minHeight: OVERLAY_HEIGHT,
              cursor: 'grab',
              touchAction: 'none',
              userSelect: 'none',
            }
      }
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className={`fixed ${
        isMobile
          ? 'bottom-6 left-1/2 -translate-x-1/2'
          : 'z-[9999]'
      } flex flex-col items-center gap-1 shadow-2xl rounded-xl bg-zinc-900/90 border border-teal-400/50 backdrop-blur select-none`}
    >
      {/* Header */}
      <div className="flex items-center w-full justify-between px-3 py-2">
        <span className="font-mono text-[0.83rem] text-teal-200 tracking-wider">{currentLabel}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded hover:bg-zinc-700 transition"
            aria-label="Collapse"
            tabIndex={0}
            style={{ outline: 'none' }}
          >
            {isMobile ? <X className="w-5 h-5 text-zinc-400" /> : <ChevronUp className="w-4 h-4 text-zinc-400" />}
          </button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center gap-2 w-full px-3 pb-2">
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
          icon={<ChevronLeft className="w-5 h-5 text-teal-400" />}
        />
        <Button
          variant="ghost"
          size="sm"
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
          size="sm"
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
        {/* Volume */}
        <div className="flex items-center gap-1 ml-2">
          <span>{volume === 0 ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(volume * 100)}
            onChange={e => setVolume(e.target.value / 100)}
            className="w-20 h-1 accent-teal-400 cursor-pointer"
            style={{ marginBottom: 2 }}
            aria-label="Volume"
          />
        </div>
      </div>
      {/* Tip */}
      {showTip && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-800/90 border border-teal-300/50 text-teal-200 text-xs px-3 py-1 rounded-xl shadow">
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

  // Render logic
  if (isMobile) {
    // MOBILE
    return (
      <AnimatePresence>
        {collapsed ? (
          MobileCollapsed
        ) : mobileVisible ? (
          OverlayUI
        ) : null}
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

