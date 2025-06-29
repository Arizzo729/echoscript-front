// src/components/IntroVideo.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * IntroVideo component
 * 
 * Displays a full-screen intro video on login with a "Skip" button.
 * Usage:
 * 1. Place your MP4 file in public/videos/intro.mp4
 * 2. Import and render this component at the top level of your app (e.g., in Layout or Dashboard):
 *    const [showIntro, setShowIntro] = useState(true);
 *    {showIntro && (<IntroVideo src="/videos/intro.mp4" onFinish={() => setShowIntro(false)} />)}
 */
export default function IntroVideo({ src, onFinish }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleSkip = () => {
    setIsVisible(false);
    onFinish?.();
  };

  const handleEnded = () => {
    setIsVisible(false);
    onFinish?.();
  };

  useEffect(() => {
    // Prevent background scrolling while intro is visible
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <video
        src={src}
        autoPlay
        className="w-full h-full object-cover"
        onEnded={handleEnded}
      />
      <div className="absolute bottom-8 right-8">
        <Button variant="outline" size="sm" onClick={handleSkip}>
          Skip
        </Button>
      </div>
    </div>
  );
}
