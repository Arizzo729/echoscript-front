// src/components/FloatingHome.jsx
import React, { useState, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg';

export default function FloatingHome() {
  // Track collapse state: 'top', 'bottom', or null
  const [collapsedEdge, setCollapsedEdge] = useState(null);
  // Store last expanded position
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });

  // Initial motion values
  const x = useMotionValue(window.innerWidth - 80);
  const y = useMotionValue(window.innerHeight - 160);

  const threshold = 100;
  const size = 56;
  const tabSize = 32;

  const handleDragEnd = useCallback((_, info) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const px = info.point.x;
    const py = info.point.y;

    // Collapse to top
    if (py < threshold) {
      setPrevPos({ x: px, y: py });
      setCollapsedEdge('top');
      animate(y, -tabSize / 2, { type: 'spring', stiffness: 300, damping: 20 });
      animate(x, vw / 2 - tabSize / 2, { type: 'spring', stiffness: 300, damping: 20 });
    }
    // Collapse to bottom
    else if (py > vh - threshold) {
      setPrevPos({ x: px, y: py });
      setCollapsedEdge('bottom');
      animate(y, vh - tabSize / 2, { type: 'spring', stiffness: 300, damping: 20 });
      animate(x, vw / 2 - tabSize / 2, { type: 'spring', stiffness: 300, damping: 20 });
    }
    // Snap to left/right edge
    else {
      setCollapsedEdge(null);
      const newX = px > vw / 2 ? vw - size - 16 : 16;
      const newY = Math.min(Math.max(py, 16), vh - size - 16);
      animate(x, newX, { type: 'spring', stiffness: 200, damping: 20 });
      animate(y, newY, { type: 'spring', stiffness: 200, damping: 20 });
    }
  }, [y, x]);

  // Render collapsed tab
  if (collapsedEdge) {
    return (
      <motion.div
        style={{ x, y }}
        className="fixed z-50 flex items-center justify-center"
        onClick={() => {
          setCollapsedEdge(null);
          animate(x, prevPos.x, { type: 'spring', stiffness: 200, damping: 20 });
          animate(y, prevPos.y, { type: 'spring', stiffness: 200, damping: 20 });
        }}
      >
        <div
          className={
            `w-${tabSize} h-${tabSize / 2} bg-teal-500 rounded-` +
            (collapsedEdge === 'top' ? 'b-full' : 't-full') +
            ' shadow-lg flex items-center justify-center'
          }
        >
          <HomeIcon className="w-5 h-5 text-white transform ' +
            (collapsedEdge === 'top' ? 'rotate-180' : '')
          } aria-hidden="true" />
        </div>
      </motion.div>
    );
  }

  // Render draggable button
  return (
    <motion.button
      style={{ x, y, touchAction: 'none' }}
      drag
      dragMomentum={false}
      dragConstraints={{ top: 0, left: 0, right: window.innerWidth - size, bottom: window.innerHeight - size }}
      onDragEnd={handleDragEnd}
      onClick={() => window.location.assign('/')}
      className="fixed z-50 w-14 h-14 bg-teal-500 rounded-full shadow-lg flex items-center justify-center"
      aria-label="Go Home"
    >
      <HomeIcon className="w-6 h-6 text-white" aria-hidden="true" />
    </motion.button>
  );
}