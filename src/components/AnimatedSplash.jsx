import React, { useEffect } from "react";

export default function AnimatedSplash({ onComplete }) {
  // TODO: Implement splash screen animation
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 50); // Quickly complete for dev
    return () => clearTimeout(timer);
  }, [onComplete]);
  return <div style={{ display: "none" }}></div>; // Hidden during dev
}