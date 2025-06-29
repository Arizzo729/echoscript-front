import React, { useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player/lazy';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

export default function IntroVideo({
  sources = [],
  onFinish,
  skipAfter = 3,
  skipLabel = 'Skip Intro',
}) {
  const [stage, setStage] = useState('idle');
  const [canSkip, setCanSkip] = useState(false);

  // Show skip button after delay once playing
  useEffect(() => {
    if (stage === 'playing') {
      const timer = setTimeout(() => setCanSkip(true), skipAfter * 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, skipAfter]);

  const handleStart = useCallback(() => {
    if (!sources || sources.length === 0) return;
    setStage('playing');
  }, [sources]);

  const handleFinish = useCallback(() => {
    setStage('finished');
    onFinish?.();
  }, [onFinish]);

  // Prepare URL list for ReactPlayer
  const urls = sources.map(source => (typeof source === 'string' ? source : source.src));

  return (
    <AnimatePresence mode="wait">
      {stage === 'idle' && (
        <motion.div
          key="idle"
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button onClick={handleStart} className="flex flex-col items-center">
            <Play size={72} className="text-white animate-pulse" />
            <span className="text-white mt-2">Click to start intro</span>
          </button>
        </motion.div>
      )}

      {stage === 'playing' && (
        <motion.div
          key="playing"
          className="fixed inset-0 z-[9999] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ReactPlayer
            url={urls}
            playing
            width="100%"
            height="100%"
            volume={0.4}
            onEnded={handleFinish}
            onError={handleFinish}
            config={{
              file: {
                attributes: {
                  preload: 'auto',
                  playsInline: true,
                  controls: false,
                },
              },
            }}
          />

          {!canSkip && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin border-4 border-teal-400 border-t-transparent rounded-full h-12 w-12" />
            </div>
          )}

          {canSkip && (
            <button
              onClick={handleFinish}
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2 rounded flex items-center space-x-1"
            >
              <X size={12} />
              <span>{skipLabel}</span>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

