// src/components/MobileOverlay.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, X } from 'lucide-react';

// Uses these classes from src/styles/mobile.css:
// .mobile-overlay, .mobile-overlay.open, .mobile-overlay .drag-handle, .audio-overlay-mobile
export default function MobileOverlay({ children }) {
  const overlayRef = useRef(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const handle = overlay.querySelector('.drag-handle');
    let startY = 0;
    let dragging = false;

    const onTouchStart = (e) => {
      dragging = true;
      startY = e.touches[0].clientY;
      overlay.style.transition = 'none';
    };

    const onTouchMove = (e) => {
      if (!dragging) return;
      const delta = e.touches[0].clientY - startY;
      if (delta > 0) overlay.style.transform = `translateY(${delta}px)`;
    };

    const onTouchEnd = () => {
      dragging = false;
      overlay.style.transition = 'transform 0.3s ease';
      const moved = parseInt(overlay.style.transform.replace(/translateY\((\d+)px\)/, '$1')) || 0;
      if (moved > 100) {
        overlay.style.transform = 'translateY(100%)';
        setIsOpen(false);
      } else {
        overlay.style.transform = 'translateY(0)';
        setIsOpen(true);
      }
    };

    handle.addEventListener('touchstart', onTouchStart);
    handle.addEventListener('touchmove', onTouchMove);
    handle.addEventListener('touchend', onTouchEnd);

    // open on mount
    setIsOpen(true);

    return () => {
      handle.removeEventListener('touchstart', onTouchStart);
      handle.removeEventListener('touchmove', onTouchMove);
      handle.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className={`mobile-overlay ${isOpen ? 'open' : ''}`}
    >
      <div className="flex items-center justify-between p-2">
        <div
          className="drag-handle"
          role="button"
          aria-label="Drag to close"
        />
        <button
          onClick={() => navigate('/')}
          className="p-2 focus:outline-none"
        >
          <Home className="w-6 h-6 text-teal-400" aria-hidden="true" />
        </button>
        <button
          onClick={() => {
            overlayRef.current.style.transform = 'translateY(100%)';
            setIsOpen(false);
          }}
          className="p-2 focus:outline-none"
        >
          <X className="w-6 h-6 text-zinc-200" aria-hidden="true" />
        </button>
      </div>
      <div className="audio-overlay-mobile">
        {children}
      </div>
    </div>
  );
}

