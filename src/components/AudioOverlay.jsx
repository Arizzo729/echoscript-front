// AudioOverlay.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Lightbulb, X } from 'lucide-react';
import Button from './ui/Button';
import { useSound } from '../context/SoundContext';

const TRACKS = [
  { label: 'OFF' },
  { label: 'BG 1' },
  { label: 'BG 2' },
  { label: 'BG 3' },
];

export default function AudioOverlay() {
  const {
    trackIndex,
    isPlaying,
    volume,
    setVolume,
    playAmbientTrack,
    togglePlay,
    nextTrack,
    prevTrack,
  } = useSound();
  const [showTip, setShowTip] = useState(true);
  const x = useMotionValue(40);
  const y = useMotionValue(80);
  const wrapperRef = useRef(null);

  // Restore position
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null) x.set(saved.x);
    if (saved.y != null) y.set(saved.y);
  }, [x, y]);

  // Save after drag
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

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (trackIndex === 0) playAmbientTrack(1);
        else togglePlay();
      } else if (e.key === 'ArrowRight') nextTrack();
      else if (e.key === 'ArrowLeft') prevTrack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [trackIndex, playAmbientTrack, togglePlay, nextTrack, prevTrack]);

  const handlePlayClick = () => {
    if (trackIndex === 0) playAmbientTrack(1);
    else togglePlay();
  };

  const currentLabel = TRACKS[trackIndex]?.label;

  return (
    <AnimatePresence>
      <motion.div
        ref={wrapperRef}
        drag
        dragMomentum={false}
        dragElastic={0}
        style={{ x, y }}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="fixed z-[9999] flex flex-col items-center gap-1 select-none drop-shadow-xl"
        onPointerDown={(e) => {
          const tag = e.target.tagName.toLowerCase();
          if (['button', 'input', 'svg', 'path'].includes(tag)) e.stopPropagation();
        }}
      >
        {showTip && (
          <div className="flex items-start gap-2 px-3 py-2 mb-1 bg-zinc-800/90 border border-teal-500/30 text-white text-xs rounded-md">
            <Lightbulb className="w-3.5 h-3.5 text-teal-300 mt-0.5" />
            <span className="text-[0.65rem] leading-tight">
              Tip: Use ← → to switch, Space to play/pause.
            </span>
            <button
              onClick={() => setShowTip(false)}
              className="ml-auto p-0 bg-transparent text-white hover:opacity-75 focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="rounded-2xl backdrop-blur-xl border border-teal-500/40 bg-zinc-900/80 shadow-md">
          <div className="flex items-center gap-3 px-4 py-2">
            <Button variant="ghost" size="sm" onClick={prevTrack} icon={<ChevronLeft className="w-4 h-4 text-teal-400" />} />
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayClick}
              icon={isPlaying && trackIndex !== 0 ? <Pause className="w-4 h-4 text-teal-400" /> : <Play className="w-4 h-4 text-teal-400" />}
            />
            <Button variant="ghost" size="sm" onClick={nextTrack} icon={<ChevronRight className="w-4 h-4 text-teal-400" />} />
            <span className="text-[0.6rem] min-w-[32px] px-2 py-0.5 rounded-full bg-zinc-800/70 text-teal-300 font-mono text-center">
              {currentLabel}
            </span>
          </div>
          <div
            className="w-full flex justify-center pb-2 px-4"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// SoundContext.jsx (unchanged)
import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

const SoundContext = createContext();
const OFF_INDEX = 0;

const TRACKS = [
  { label: 'OFF', src: null, gain: 0 },
  { label: 'BG 1', src: new URL('../assets/sounds/ambient-loop-1.mp3', import.meta.url).href, gain: 0.2 },
  { label: 'BG 2', src: new URL('../assets/sounds/ambient-loop-2.mp3', import.meta.url).href, gain: 0.4 },
  { label: 'BG 3', src: new URL('../assets/sounds/ambient-loop-3.mp3', import.meta.url).href, gain: 0.4 },
];

export function SoundProvider({ children, initialVolume = 0.4 }) {
  const [isMuted, setIsMuted] = useState(true);
  const [sfxMuted, setSfxMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(OFF_INDEX);
  const [volume, setVolume] = useState(initialVolume);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(TRACKS[OFF_INDEX].label);
  const [isPlaying, setIsPlaying] = useState(false);

  const mainAudioRef = useRef(null);
  const clickRef = useRef(null);
  const fadeRef = useRef(null);

  const CLICK_SRC = useMemo(
    () => new URL('../assets/sounds/playPop.mp3', import.meta.url).href,
    []
  );

  // ... rest of SoundContext code remains unchanged ...

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        sfxMuted,
        volume,
        setVolume,
        trackIndex,
        setTrackIndex,
        nowPlaying,
        isPlaying,
        playAmbientTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        toggleAmbient,
        toggleMute,
        enableSound,
        disableSound,
        playClick,
        setSfxMuted,
        setIsMuted,
        isUnlocked,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
