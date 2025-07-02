// ✅ EchoScript.AI — AudioOverlay SYNCED + ENHANCED
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
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
  const x = useMotionValue(40);
  const y = useMotionValue(80);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
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
    if (!track || !track.src || !audioRef.current || !isUnlocked) return;
    try {
      const adjustedVolume = Math.min(volume, 1.0) * (track.gain || 0.4);
      audioRef.current.pause();
      audioRef.current.src = track.src;
      audioRef.current.volume = adjustedVolume;
      audioRef.current.load();
      await audioRef.current.play();
      setTrackIndex(index);
      setIsPlaying(true);
    } catch (err) {
      console.warn(`Failed to play ${track.label}:`, err.message);
    }
  };

  const pauseTrack = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!isUnlocked) {
      enableSound();
      return;
    }
    if (trackIndex === 0) {
      await playTrack(1);
    } else if (isPlaying) {
      pauseTrack();
    } else {
      await playTrack(trackIndex);
    }
  };

  const handleNext = async () => {
    let next = (trackIndex + 1) % TRACKS.length;
    setTrackIndex(next);
    if (next === 0) {
      pauseTrack();
    } else {
      await playTrack(next);
    }
  };

  const handlePrev = async () => {
    let prev = (trackIndex - 1 + TRACKS.length) % TRACKS.length;
    setTrackIndex(prev);
    if (prev === 0) {
      pauseTrack();
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
          <div
            className="w-full flex justify-center mt-0.5"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (audioRef.current) {
                  const gain = TRACKS[trackIndex]?.gain || 0.4;
                  audioRef.current.volume = v * gain;
                }
              }}
              className="w-40 h-1 accent-teal-400 cursor-pointer z-50 touch-none"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

