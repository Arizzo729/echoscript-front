// src/components/MobileOverlay.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, X } from 'lucide-react';
import '../styles/mobile.css';

export default function MobileOverlay({ children }) {
  const overlayRef = useRef(null);
  const [translateY, setTranslateY] = useState(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const navigate = useNavigate();

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
      className="md:hidden fixed bottom-16 left-1/2 transform -translate-x-1/2 w-[90%] max-h-[70vh] bg-zinc-900/90 backdrop-blur-lg rounded-t-xl shadow-lg z-20 transition-transform duration-300"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      {/* Header: drag handle, home & close buttons */}
      <div className="flex items-center justify-between p-2">
        <div
          className="drag-handle w-10 h-1 bg-zinc-500 rounded-full mx-auto touch-pan-y"
          aria-hidden="true"
        />
        <button onClick={() => navigate('/')} className="p-1 focus:outline-none">
          <Home className="w-6 h-6 text-teal-400" aria-hidden="true" />
        </button>
        <button onClick={() => setTranslateY(window.innerHeight)} className="p-1 focus:outline-none">
          <X className="w-6 h-6 text-zinc-200" aria-hidden="true" />
        </button>
      </div>

      {/* Content area */}
      <div className="px-4 pb-4 overflow-auto">
        {children}
      </div>
    </div>
  );
}
