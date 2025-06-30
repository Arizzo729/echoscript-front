// src/components/AudioOverlay.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

/**
 * AudioOverlay — draggable ambient control with minimize/restore and refined UI.
 * 1. Unique "Off" via nowPlaying
 * 2. Drag constrained to viewport via constraintsRef
 * 3. Smooth enter/exit animations
 * 4. Frosted glass backdrop blur
 * 5. Teal-blue gradient when active
 * 6. Pointer-events for interactivity
 * 7. Minimize/restore icons
 * 8. Hover and tap feedback
 * 9. Accessible ARIA labels
 * 10. Consistent sizing and padding
 */
export default function AudioOverlay() {
  const { toggleAmbient, nowPlaying, trackIndex, isMuted } = useSound();
  const [minimized, setMinimized] = useState(false);
  const constraintsRef = useRef(null);

  const displayText = nowPlaying;

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />

      {minimized ? (
        <motion.div
          className="fixed bottom-4 right-4 z-50 pointer-events-auto"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          whileTap={{ scale: 1.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => setMinimized(false)}
            aria-label="Restore Audio Controls"
          >
            🎵
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed bottom-4 right-4 z-50 pointer-events-auto"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          whileDrag={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="bg-gradient-to-r from-teal-500 to-blue-500 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-xl p-2 flex items-center space-x-2 pointer-events-auto"
            whileHover={{ scale: 1.02 }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <button
              onClick={() => setMinimized(true)}
              className="text-white hover:text-gray-200 p-1"
              aria-label="Minimize Audio Controls"
            >
              ✕
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleAmbient(); }}
              className="flex items-center space-x-1 px-3 py-1 bg-white/30 hover:bg-white/40 text-white rounded-full text-sm font-medium shadow-lg focus:outline-none"
              aria-label="Toggle Ambient"
            >
              <span>🎵</span>
              <span className="whitespace-nowrap">{displayText}</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
