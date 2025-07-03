// src/components/MobileOverlay.jsx
import React, { useRef, useEffect, useState } from 'react';
import '../styles/mobile.css';

export default function MobileOverlay({ children }) {
  const overlayRef = useRef(null);
  const [translateY, setTranslateY] = useState(0);
  const startY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const handle = overlay.querySelector('.drag-handle');

    const onTouchStart = (e) => {
      isDragging.current = true;
      startY.current = e.touches[0].clientY - translateY;
      overlay.style.transition = 'none';
    };

    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      const deltaY = e.touches[0].clientY - startY.current;
      setTranslateY(Math.max(0, deltaY));
    };

    const onTouchEnd = () => {
      isDragging.current = false;
      overlay.style.transition = 'transform 0.3s ease';
      if (translateY > 100) {
        setTranslateY(window.innerHeight);
      } else {
        setTranslateY(0);
      }
    };

    handle.addEventListener('touchstart', onTouchStart);
    handle.addEventListener('touchmove', onTouchMove);
    handle.addEventListener('touchend', onTouchEnd);

    return () => {
      handle.removeEventListener('touchstart', onTouchStart);
      handle.removeEventListener('touchmove', onTouchMove);
      handle.removeEventListener('touchend', onTouchEnd);
    };
  }, [translateY]);

  return (
    <div
      ref={overlayRef}
      className="overlay fade-in"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      <div className="drag-handle" aria-hidden="true" />
      {children}
    </div>
  );
}

/* Note: Move the following CSS into src/styles/mobile.css */
/*
@media (max-width: 768px) {
  .overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 80vh;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(12px);
    border-top-left-radius: var(--radius-lg);
    border-top-right-radius: var(--radius-lg);
    box-shadow: var(--shadow-strong);
    overflow: hidden;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 1000;
  }

  .overlay.fade-in {
    transform: translateY(0);
  }

  .drag-handle {
    width: 40px;
    height: 4px;
    background: var(--color-secondary-text);
    border-radius: 2px;
    margin: 8px auto;
    touch-action: none;
    cursor: grab;
  }
}
*/
