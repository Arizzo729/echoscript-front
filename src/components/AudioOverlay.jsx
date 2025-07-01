// src/components/AudioOverlay.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Repeat } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../context/SoundContext';

export default function AudioOverlay() {
  const { toggleAmbient, nowPlaying, trackIndex, isMuted } = useSound();
  const [minimized, setMinimized] = useState(false);
  const x = useMotionValue(12);
  const y = useMotionValue(window.innerHeight - 64);
  const ref = useRef(null);

  // load saved position
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
    if (saved.x != null && saved.y != null) {
      x.set(saved.x); y.set(saved.y);
    }
  }, [x,y]);

  // snap on drag
  const endDrag = (_, info) => {
    const m = 12, w = window.innerWidth, h = window.innerHeight;
    const snapX = info.point.x > w/2 ? w - m - ref.current.clientWidth : m;
    const snapY = info.point.y > h/2 ? h - m - ref.current.clientHeight : m;
    x.set(snapX); y.set(snapY);
    localStorage.setItem('audio-overlay-pos', JSON.stringify({ x: snapX, y: snapY }));
  };

  const active = !isMuted && trackIndex > 0;

  const container = twMerge(
    'fixed z-50 bg-zinc-900/70 backdrop-blur-lg rounded-xl shadow-lg',
    minimized ? 'w-8 h-8 p-0' : 'flex items-center space-x-2 px-2 py-1'
  );

  const btn = twMerge(
    'p-1 rounded-full transition',
    active ? 'bg-teal-500 hover:bg-teal-600 text-white'
           : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
  );

  return (
    <motion.div
      ref={ref}
      style={{ x,y }}
      drag dragMomentum={false} dragElastic={0.2}
      onDragEnd={endDrag}
      className={container}
      initial={{ opacity:0, scale:0.9 }}
      animate={{ opacity:1, scale:1 }}
    >
      {minimized ? (
        <button onClick={()=>setMinimized(false)} className="w-full h-full flex items-center justify-center text-white">
          🎵
        </button>
      ) : (
        <>
          <button onClick={()=>setMinimized(true)} className="absolute -top-1 -right-1 text-xs text-gray-400 hover:text-white">
            ✕
          </button>
          <button onClick={e=>{e.stopPropagation(); toggleAmbient()}} className={btn}>
            <Repeat className="w-4 h-4" />
          </button>
          {/* optional label; remove if you want pure icon */}
          {/* <span className={active ? 'text-teal-300 text-xs' : 'text-zinc-400 text-xs'}>
            {active ? nowPlaying : 'Off'}
          </span> */}
        </>
      )}
    </motion.div>
  );
}

