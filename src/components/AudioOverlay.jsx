// ✅ EchoScript.AI — AudioOverlay FINAL FIXED
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Button from './ui/Button';
import { useSound } from '../context/SoundContext';

const TRACKS = [
  { label: 'OFF', src: null },
  { label: 'BG 1', src: new URL('../assets/sounds/ambient-loop-1.mp3', import.meta.url).href },
  { label: 'BG 2', src: new URL('../assets/sounds/ambient-loop-2.mp3', import.meta.url).href },
  { label: 'BG 3', src: new URL('../assets/sounds/ambient-loop-3.mp3', import.meta.url).href },
];

export default function AudioOverlay() {
  const context = useSound();

  // Fallback if useSound() returns undefined or incomplete context
  const audioRefFallback = useRef(null);
  const {
    trackIndex = 0,
    setTrackIndex = () => {},
    isPlaying = false,
    setIsPlaying = () => {},
    volume = 0.5,
    setVolume = () => {},
    audioRef = audioRefFallback,
    enableSound = () => {},
    isUnlocked = false
  } = context || {};

  const [hidden, setHidden] = useState(false);
  const [refError, setRefError] = useState(false);
  const x = useMotionValue(40);
  const y = useMotionValue(80);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!audioRef?.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
  }, [audioRef]);

  useEffect(() => {
    if (!window.__introPlayed) setHidden(true);
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null) x.set(saved.x);
    if (saved.y != null) y.set(saved.y);
  }, [x, y]);

  const playTrack = async (index) => {
    const track = TRACKS[index];
    if (!track || !track.src || !audioRef?.current || !isUnlocked) return;
    try {
      audioRef.current.src = track.src;
      audioRef.current.volume = volume;
      await audioRef.current.load();
      await audioRef.current.play();
      setTrackIndex(index);
      setIsPlaying(true);
    } catch (err) {
      console.error('Audio play failed:', err);
      setRefError(true);
    }
  };

  const pauseTrack = () => {
    audioRef?.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    if (!isUnlocked) {
      enableSound();
      return;
    }
    if (trackIndex === 0) {
      await playTrack(1);
    } else {
      isPlaying ? pauseTrack() : await playTrack(trackIndex);
    }
  };

  const handleNext = async () => {
    const next = (trackIndex + 1) % TRACKS.length;
    if (next === 0) {
      pauseTrack();
      setTrackIndex(0);
    } else {
      await playTrack(next);
    }
  };

  const handlePrev = async () => {
    const prev = (trackIndex - 1 + TRACKS.length) % TRACKS.length;
    if (prev === 0) {
      pauseTrack();
      setTrackIndex(0);
    } else {
      await playTrack(prev);
    }
  };

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

  const currentLabel = TRACKS[trackIndex]?.label || 'OFF';

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
            if (["button", "input", "svg", "path"].includes(tag)) {
              e.stopPropagation();
            }
          }}
        >
          {refError && (
            <div className="text-xs text-red-500 bg-red-900/40 px-3 py-1 rounded mb-1 shadow">
              Audio failed to play or ref is broken.
            </div>
          )}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full shadow-md border border-teal-600 bg-gradient-to-br from-zinc-950/90 to-zinc-900/80 backdrop-blur-xl">
            <Button variant="ghost" size="sm" onClick={handlePrev} icon={<ChevronLeft className="w-4 h-4 text-teal-400" />} />
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              icon={
                isPlaying && trackIndex !== 0 ? (
                  <Pause className="w-4 h-4 text-teal-400" />
                ) : (
                  <Play className="w-4 h-4 text-teal-400" />
                )
              }
            />
            <Button variant="ghost" size="sm" onClick={handleNext} icon={<ChevronRight className="w-4 h-4 text-teal-400" />} />
            <span className="text-[0.6rem] min-w-[32px] px-2 py-0.5 rounded-full bg-zinc-800/70 text-teal-300 font-mono text-center">
              {currentLabel}
            </span>
          </div>
          <div className="w-full flex justify-center mt-0.5">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (audioRef?.current) audioRef.current.volume = v;
              }}
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

