// src/components/AnimatedSplash.jsx
import { useEffect } from 'react';

/**
 * AnimatedSplash (Stub)
 * The original animated splash has been removed. This stub simply calls
 * the provided onComplete callback and renders nothing. It is still imported
 * throughout the app to preserve the onboarding flow.
 */
export default function AnimatedSplash({ onComplete }) {
  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return null;
}



