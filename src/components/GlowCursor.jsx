// src/components/GlowCursor.jsx
import React, { useEffect, useState } from "react";

export default function GlowCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [touchPressure, setTouchPressure] = useState(0);

  useEffect(() => {
    const updateMouse = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setTouchPressure(0); // no pressure from mouse
    };

    const updateTouch = (e) => {
      const touch = e.touches[0];
      setPosition({ x: touch.clientX, y: touch.clientY });
      setTouchPressure(touch.force || 0.5); // some devices may support `touch.force` (0.0–1.0)
    };

    const endTouch = () => setTouchPressure(0);

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("touchmove", updateTouch);
    window.addEventListener("touchend", endTouch);
    window.addEventListener("touchcancel", endTouch);

    return () => {
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("touchmove", updateTouch);
      window.removeEventListener("touchend", endTouch);
      window.removeEventListener("touchcancel", endTouch);
    };
  }, []);

  const size = touchPressure > 0 ? 200 + touchPressure * 100 : 160;
  const opacity = touchPressure > 0 ? 0.2 + touchPressure * 0.5 : 0.15;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-0 transition duration-75 ease-out"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(0,255,255,${opacity}), transparent 70%)`,
        borderRadius: "50%",
        transform: `translate(${position.x - size / 2}px, ${position.y - size / 2}px)`,
        mixBlendMode: "screen",
        willChange: "transform, background",
      }}
    />
  );
}
