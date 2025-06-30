// src/components/AudioOverlay.jsx
import React from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

export default function AudioOverlay() {
  const { toggleAmbient, nowPlaying, trackIndex, isMuted } = useSound();
  const ambientOn = !isMuted && trackIndex > 0;

  return (
    <Draggable bounds="parent" cancel=".no-drag">
      <div
        className="absolute top-6 right-6 z-20 cursor-grab touch-none"
        style={{ touchAction: 'none' }}
      >
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            toggleAmbient();
          }}
          whileTap={{ scale: 0.9 }}
          className={`no-drag flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg transition ${
            ambientOn
              ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
              : 'bg-zinc-800/50 text-zinc-300 border border-zinc-600'
          }`}
        >
          🎵 {ambientOn ? nowPlaying : 'Music Off'}
        </motion.button>
      </div>
    </Draggable>
  );
}
