import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Lightbulb, X } from 'lucide-react';
import Button from './ui/Button';
import { useSound } from '../context/SoundContext';
import useIsMobile from '../hooks/useIsMobile';

const TRACKS = [
  { label: 'OFF' },
  { label: 'BG 1' },
  { label: 'BG 2' },
  { label: 'BG 3' }
];

export default function AudioOverlay() {
  const isMobileLayout = useIsMobile();
  const { trackIndex, isPlaying, volume, setVolume, playAmbientTrack, togglePlay } = useSound();
  const [showTip, setShowTip] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(true);

  const x = useMotionValue(48);
  const y = useMotionValue(96);
  const wrapperRef = useRef(null);

  // Load saved position
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (typeof saved.x === 'number') x.set(saved.x);
    if (typeof saved.y === 'number') y.set(saved.y);
  }, [x, y]);

  // Save on drag end
  const handleDragEnd = (_, info) => {
    if (!wrapperRef.current) return;
    const node = wrapperRef.current;
    const maxX = window.innerWidth - node.offsetWidth;
    const maxY = window.innerHeight - node.offsetHeight;
    const clampedX = Math.min(Math.max(0, info.point.x), maxX);
    const clampedY = Math.min(Math.max(0, info.point.y), maxY);
    x.set(clampedX);
    y.set(clampedY);
    localStorage.setItem(
      'audio-overlay-pos',
      JSON.stringify({ x: clampedX, y: clampedY })
    );
  };

  // Keyboard controls
  useEffect(() => {
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
  }, [trackIndex, busy, playAmbientTrack, togglePlay]);

  const currentLabel = TRACKS[trackIndex]?.label;

  return (
    <>
      {/* Desktop overlay */}
      {!isMobileLayout && (
        <AnimatePresence>
          <motion.div
            ref={wrapperRef}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragEnd={handleDragEnd}
            style={{ x, y, touchAction: 'none', cursor: 'grab' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed z-[9999] flex flex-col items-center gap-1 select-none shadow-lg"
          >
            {showTip && (
              <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800/80 border border-teal-400/50 text-white text-[0.55rem] rounded">
                <Lightbulb className="w-3 h-3 text-teal-300" />
                <span>← → to switch, Space to play/pause</span>
                <button
                  onClick={() => setShowTip(false)}
                  onPointerDownCapture={e => e.stopPropagation()}
                  className="ml-auto p-1 bg-transparent hover:bg-zinc-700 rounded"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur bg-zinc-900/70 border border-teal-400/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!busy) {
                    setBusy(true);
                    playAmbientTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length);
                    setTimeout(() => setBusy(false), 300);
                  }
                }}
                icon={<ChevronLeft className="w-4 h-4 text-teal-400" />}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  trackIndex === 0 ? playAmbientTrack(1) : togglePlay()
                }
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
                onClick={() => {
                  if (!busy) {
                    setBusy(true);
                    playAmbientTrack((trackIndex + 1) % TRACKS.length);
                    setTimeout(() => setBusy(false), 300);
                  }
                }}
                icon={<ChevronRight className="w-4 h-4 text-teal-400" />}
              />
              <div className="px-2 py-0.5 bg-zinc-800/70 rounded-full text-[0.65rem] text-teal-300 font-mono">
                {currentLabel}
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={volume * 100}
                onChange={e => setVolume(e.target.value / 100)}
                onPointerDownCapture={e => e.stopPropagation()}
                className="w-20 h-1 accent-teal-400 cursor-pointer"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Mobile overlay */}
      {isMobileLayout && mobileVisible && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-2 py-1 bg-zinc-800/90 backdrop-blur border border-teal-400/50 rounded-full shadow-lg z-[9999]"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!busy) {
                  setBusy(true);
                  playAmbientTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length);
                  setTimeout(() => setBusy(false), 300);
                }
              }}
              icon={<ChevronLeft className="w-4 h-4 text-teal-300" />}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                trackIndex === 0 ? playAmbientTrack(1) : togglePlay()
              }
              icon={
                isPlaying ? (
                  <Pause className="w-4 h-4 text-teal-300" />
                ) : (
                  <Play className="w-4 h-4 text-teal-300" />
                )
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!busy) {
                  setBusy(true);
                  playAmbientTrack((trackIndex + 1) % TRACKS.length);
                  setTimeout(() => setBusy(false), 300);
                }
              }}
              icon={<ChevronRight className="w-4 h-4 text-teal-300" />}
            />
            <div className="text-[0.65rem] font-mono text-teal-300 px-1">
              {currentLabel}
            </div>
            <button
              onClick={() => setMobileVisible(false)}
              className="p-1 bg-transparent hover:bg-zinc-700 rounded"
>

