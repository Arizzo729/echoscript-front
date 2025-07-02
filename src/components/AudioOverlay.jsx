import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Pause, Play, Minus, Volume2, VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import Button from './ui/Button'; // adjust this path if your Button lives elsewhere

export default function AudioOverlay() {
  const {
    trackIndex, isMuted, isPlaying,
    togglePlay, nextTrack, prevTrack,
    playAmbientTrack, setMuted,
  } = useSound();

  const trackLabels = [
    'BG 1 — Dreamscape Horizon',
    'BG 2 — Midnight Flow',
    'BG 3 — Echo Drift',
    'OFF',
  ];

  const isOff = trackIndex >= trackLabels.length - 1;
  const [minimized, setMinimized] = useState(false);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [volume, setVolume] = useState(1);
  const [position, setPosition] = useState({ x: 40, y: 80 });
  const [hidden, setHidden] = useState(false);

  const overlayRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.__introPlayed) setHidden(true);
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) setPosition(saved);
  }, []);

  useEffect(() => {
    const node = overlayRef.current;
    const onMouseMove = (e) => {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      const maxX = window.innerWidth - node.offsetWidth;
      const maxY = window.innerHeight - node.offsetHeight;
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      localStorage.setItem('audio-overlay-pos', JSON.stringify(position));
    };

    const onMouseDown = (e) => {
      if (e.button !== 0 || e.target.closest('button, input')) return;
      const bounds = node.getBoundingClientRect();
      dragOffset.current.x = e.clientX - bounds.left;
      dragOffset.current.y = e.clientY - bounds.top;
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    if (node && !minimized) node.addEventListener('mousedown', onMouseDown);
    return () => node?.removeEventListener('mousedown', onMouseDown);
  }, [position, minimized]);

  const handlePlayToggle = () => (isOff ? playAmbientTrack(0) : togglePlay());
  const handleMinimize = () => {
    const icon = document.getElementById('header-music-icon');
    if (icon) {
      const rect = icon.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
    setMinimized(true);
  };

  const currentTrack = isOff ? 'OFF' : trackLabels[trackIndex];

  return (
    <AnimatePresence>
      {!minimized && !hidden && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="fixed z-[9999] w-[230px] rounded-xl shadow-lg border border-teal-600 bg-gradient-to-br from-zinc-950/90 to-zinc-900/80 backdrop-blur-xl px-4 py-3 flex flex-col items-center gap-3 select-none cursor-move"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimize}
            aria-label="Minimize"
            className="absolute top-2 right-2"
            icon={<Minus className="w-4 h-4 text-teal-400" />}
          />

          <div className="flex items-center justify-center gap-3 mt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTrack}
              aria-label="Previous"
              icon={<ChevronLeft className="w-5 h-5 text-teal-400" />}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayToggle}
              aria-label="Play"
              icon={
                isPlaying && !isOff ? (
                  <Pause className="w-5 h-5 text-teal-400" />
                ) : (
                  <Play className="w-5 h-5 text-teal-400" />
                )
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              aria-label="Next"
              icon={<ChevronRight className="w-5 h-5 text-teal-400" />}
            />
          </div>

          <span className="text-[0.65rem] text-teal-200 bg-zinc-800/60 px-3 py-1 rounded-full font-mono text-center">
            {currentTrack}
          </span>

          <div className="relative w-full flex justify-center items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVolumeVisible(!volumeVisible)}
              aria-label="Volume"
              icon={
                isMuted ? (
                  <VolumeX className="w-5 h-5 text-teal-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-teal-400" />
                )
              }
            />
            {volumeVisible && (
              <div className="absolute bottom-full mb-2 w-28">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    setMuted(val === 0);
                  }}
                  className="w-full accent-teal-400"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}







