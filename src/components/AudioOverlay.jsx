// ✅ EchoScript.AI — AudioOverlay FINAL: Stable, Synced, Styled
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Lightbulb, X } from 'lucide-react';
import Button from './ui/Button';
import { useSound } from '../context/SoundContext';

const TRACKS = [
  { label: 'OFF', src: null, gain: 0 },
  { label: 'BG 1', src: new URL('../assets/sounds/ambient-loop-1.mp3', import.meta.url).href, gain: 0.2 },
  { label: 'BG 2', src: new URL('../assets/sounds/ambient-loop-2.mp3', import.meta.url).href, gain: 0.4 },
  { label: 'BG 3', src: new URL('../assets/sounds/ambient-loop-3.mp3', import.meta.url).href, gain: 0.4 },
];

export default function AudioOverlay() {
  const context = useSound();
  const audioRefFallback = useRef(null);
  const isTransitioningRef = useRef(false);
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
  const [showTip, setShowTip] = useState(true);
  const x = useMotionValue(40);
  const y = useMotionValue(80);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    if (!localStorage.getItem("audio-default-volume")) {
      setVolume(0.5);
      localStorage.setItem("audio-default-volume", "0.5");
    }
    setTrackIndex(0);
    setIsPlaying(false);
  }, [audioRef]);

  useEffect(() => {
    if (!window.__introPlayed) setHidden(true);
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null) x.set(saved.x);
    if (saved.y != null) y.set(saved.y);
  }, [x, y]);

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
    }
  };

  const playTrack = useCallback(async (index) => {
    if (isTransitioningRef.current) return;
    const track = TRACKS[index];
    if (!track || !track.src || !audioRef.current || !isUnlocked) return;
    try {
      isTransitioningRef.current = true;
      stopTrack();
      audioRef.current.src = track.src;
      audioRef.current.volume = volume * (track.gain || 0.4);
      await audioRef.current.play();
      setTrackIndex(index);
      setIsPlaying(true);
    } catch (err) {
      console.warn(`Failed to play ${track.label}:`, err.message);
    } finally {
      isTransitioningRef.current = false;
    }
  }, [volume, audioRef, isUnlocked, setTrackIndex, setIsPlaying]);

  const pauseTrack = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (isTransitioningRef.current) return;
    if (!isUnlocked) {
      enableSound();
      return;
    }
    if (trackIndex === 0) {
      await playTrack(1);
    } else {
      if (isPlaying) pauseTrack();
      else await playTrack(trackIndex);
    }
  };

  const handleNext = async () => {
    if (isTransitioningRef.current) return;
    const next = (trackIndex + 1) % TRACKS.length;
    await playTrack(next);
  };

  const handlePrev = async () => {
    if (isTransitioningRef.current) return;
    const prev = (trackIndex - 1 + TRACKS.length) % TRACKS.length;
    await playTrack(prev);
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

  useEffect(() => {
    const handleKey = async (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        await togglePlay();
      } else if (e.key === 'ArrowRight') {
        await handleNext();
      } else if (e.key === 'ArrowLeft') {
        await handlePrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePlay, handleNext, handlePrev]);

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
          className="fixed z-[9999] flex flex-col items-center gap-1 select-none drop-shadow-xl pointer-events-auto"
          onPointerDown={(e) => {
            const tag = e.target.tagName.toLowerCase();
            const blockDrag = ["button", "input", "svg", "path"];
            if (blockDrag.includes(tag)) e.stopPropagation();
          }}
        >
          {showTip && (
            <div className="flex items-start gap-2 px-3 py-2 mb-1 bg-zinc-800/90 border border-teal-500/30 text-white text-xs rounded-md shadow shadow-teal-500/10">
              <Lightbulb className="w-3.5 h-3.5 text-teal-300 mt-0.5" />
              <span className="text-[0.65rem] leading-tight">
                Tip: Use ← → arrows to switch tracks, Space to play/pause.
              </span>
              <button onClick={() => setShowTip(false)} className="ml-auto text-teal-300 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="rounded-2xl backdrop-blur-xl border border-teal-500/40 bg-zinc-900/80 shadow-md shadow-teal-600/20">
            <div className="flex items-center gap-3 px-4 py-2">
              <Button variant="ghost" size="sm" onClick={handlePrev} icon={<ChevronLeft className="w-4 h-4 text-teal-400" />} />
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                icon={
                  isPlaying && trackIndex !== 0 ? (
                    <Pause className="w-4 h-4 text-teal-400 transition duration-150" />
                  ) : (
                    <Play className="w-4 h-4 text-teal-400 transition duration-150" />
                  )
                }
              />
              <Button variant="ghost" size="sm" onClick={handleNext} icon={<ChevronRight className="w-4 h-4 text-teal-400" />} />
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
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  const gain = TRACKS[trackIndex]?.gain || 0.4;
                  if (audioRef.current) audioRef.current.volume = v * gain;
                }}
                className="w-40 h-1 accent-teal-400 cursor-pointer touch-none"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


