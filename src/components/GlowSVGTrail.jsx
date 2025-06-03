import React, { useEffect, useRef, useState } from "react";

const MAX_POINTS = 25;
const COLLAPSE_DELAY = 100;

export default function GlowSVGTrail() {
  const [points, setPoints] = useState([]);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef(null);

  // Listen to mouse/touch
  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;

      setPoints((prev) => {
        const updated = [...prev, { x, y }];
        return updated.length > MAX_POINTS ? updated.slice(-MAX_POINTS) : updated;
      });

      setIsIdle(false);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), COLLAPSE_DELAY);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  // Trail path
  const pathData = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  const lastPoint = points[points.length - 1] ?? { x: 0, y: 0 };

  return (
    <svg className="pointer-events-none fixed top-0 left-0 z-0 w-full h-full">
      <defs>
        <filter id="etherealGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.1
                    0 1 0.95 0 0.4
                    0 0.9 1 0 0.6
                    0 0 0 0.3 0"
            result="glow"
          />
          <feBlend in="SourceGraphic" in2="glow" mode="screen" />
        </filter>
      </defs>

      {isIdle ? (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={25}
          fill="url(#glowCircle)"
          filter="url(#etherealGlow)"
        />
      ) : (
        <path
          d={pathData}
          fill="none"
          stroke="hsl(185, 100%, 75%)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#etherealGlow)"
          opacity="0.4"
        />
      )}
    </svg>
  );
}
