import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft, ChevronRight, Pause, Play, X, ChevronUp, ChevronDown, Volume2, VolumeX, Music
} from 'lucide-react';
import Button from './ui/Button';
import { useSound } from '../context/SoundContext';
import useIsMobile from '../hooks/useIsMobile';

const TRACKS = (t) => [
  { label: t('audio.off', 'OFF') },
  { label: t('audio.bg1', 'BG 1') },
  { label: t('audio.bg2', 'BG 2') },
  { label: t('audio.bg3', 'BG 3') }
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
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { trackIndex, isPlaying, volume, setVolume, playAmbientTrack, togglePlay, isMuted, toggleMute } = useSound();
  const [collapsed, setCollapsed] = useState(() =>
    JSON.parse(localStorage.getItem('audio-overlay-collapsed') || 'false')
  );
  const [busy, setBusy] = useState(false);

  const activeTracks = TRACKS(t);

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

  const currentLabel = activeTracks[trackIndex]?.label;

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
        padding: '0 12px 0 8px',
        touchAction: 'none',
        userSelect: 'none',
        overflow: 'visible'
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Previous"
        onClick={() => {
          if (!busy) {
            setBusy(true);
            playAmbientTrack((trackIndex - 1 + activeTracks.length) % activeTracks.length);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        icon={<ChevronLeft className="w-5 h-5 text-teal-400" />}
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={() => {
          if (trackIndex === 0) {
            playAmbientTrack(1);
          } else {
            togglePlay();
          }
        }}
        className="active:scale-90 transition-transform"
        icon={
          isPlaying ? (
            <Pause className="w-5 h-5 text-teal-400 fill-teal-400" />
          ) : (
            <Play className="w-5 h-5 text-teal-400 fill-teal-400" />
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
            const next = (trackIndex + 1) % activeTracks.length;
            playAmbientTrack(next === 0 ? 1 : next);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        className="active:scale-90 transition-transform"
        icon={<ChevronRight className="w-5 h-5 text-teal-400" />}
      />
      <span className="ml-1 mr-1 font-mono text-[0.83rem] text-teal-200 tracking-wider select-none min-w-[40px] text-center">
        {currentLabel}
      </span>
      <div className="flex items-center gap-2 px-2 flex-1 group">
        <button onClick={() => toggleMute()} className="hover:scale-110 transition-transform">
          {volume === 0 || isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={isMuted ? 0 : Math.round(volume * 100)}
          onChange={e => {
            const val = parseInt(e.target.value) / 100;
            setVolume(val);
            if (val > 0 && isMuted) toggleMute();
          }}
          className="flex-1 h-1 accent-teal-400 cursor-pointer appearance-none bg-zinc-700 rounded-lg"
          aria-label="Volume"
        />
      </div>
      <button
        onClick={() => setCollapsed(true)}
        className="flex items-center justify-center p-0 w-8 h-8 rounded-full hover:scale-110 transition mr-1"
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
        padding: '0 16px',
        overflow: 'visible'
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
            playAmbientTrack((trackIndex - 1 + activeTracks.length) % activeTracks.length);
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
        onClick={() => {
          if (trackIndex === 0) {
            playAmbientTrack(1);
          } else {
            togglePlay();
          }
        }}
        className="px-1 active:scale-90 transition-transform"
        icon={
          isPlaying ? (
            <Pause className="w-4 h-4 text-teal-400 fill-teal-400" />
          ) : (
            <Play className="w-4 h-4 text-teal-400 fill-teal-400" />
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
            const next = (trackIndex + 1) % activeTracks.length;
            playAmbientTrack(next === 0 ? 1 : next);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        className="px-1 active:scale-90 transition-transform"
        icon={<ChevronRight className="w-4 h-4 text-teal-400" />}
      />
      <span className="ml-1 mr-1 font-mono text-[0.80rem] text-teal-200 tracking-wider select-none min-w-[36px] text-center">
        {currentLabel}
      </span>
      <button onClick={() => toggleMute()} className="p-1 hover:scale-110 transition-transform flex-shrink-0">
        {volume === 0 || isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', minWidth: 80, maxWidth: 100 }}>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={isMuted ? 0 : Math.round(volume * 100)}
          onChange={e => {
            const val = parseInt(e.target.value) / 100;
            setVolume(val);
            if (val > 0 && isMuted) toggleMute();
          }}
          className="w-full h-1 accent-teal-400 cursor-pointer appearance-none bg-zinc-700 rounded-lg"
          aria-label="Volume"
        />
      </div>
      <button
        onClick={() => setCollapsed(true)}
        className="flex items-center justify-center p-0 w-7 h-7 rounded-full hover:scale-110 transition mr-1"
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
      <span className="text-teal-200 text-[0.8rem] font-medium tracking-wide">{t("audio.ambient_title", "Ambient Audio")}</span>
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
