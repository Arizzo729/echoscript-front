// -----------------------------------------------------------------------------
// Overlay.jsx – Enhanced Mobile Overlay Component
// -----------------------------------------------------------------------------
import React, { useRef, useEffect } from 'react';
import './styles/mobile.css';

export default function MobileOverlay({ children }) {
  const overlayRef = useRef();
  const handleRef = useRef();
  let start = { x: 0, y: 0 };

  useEffect(() => {
    const overlay = overlayRef.current;
    const handle = handleRef.current;

    const onTouchStart = e => {
      const { clientX, clientY } = e.touches[0];
      start.x = clientX - overlay.offsetLeft;
      start.y = clientY - overlay.offsetTop;
      overlay.style.transition = 'none';
    };
    const onTouchMove = e => {
      const { clientX, clientY } = e.touches[0];
      overlay.style.left = `${clientX - start.x}px`;
      overlay.style.top = `${clientY - start.y}px`;
    };

    handle.addEventListener('touchstart', onTouchStart);
    handle.addEventListener('touchmove', onTouchMove);

    return () => {
      handle.removeEventListener('touchstart', onTouchStart);
      handle.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div ref={overlayRef} className="overlay fade-in">
      {children}
      <div ref={handleRef} className="drag-handle" aria-label="Drag Handle" />
    </div>
  );
}
