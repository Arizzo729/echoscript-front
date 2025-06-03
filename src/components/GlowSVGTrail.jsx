import React, { useEffect, useRef, useState } from "react";

const MAX_POINTS = 30;
const SMOOTHING = 0.2;
const IDLE_FADE = 0.02;

export default function GlowSVGTrail() {
  const [points, setPoints] = useState([]);
  const current = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const move = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      target.current = { x, y };
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      // Interpolate toward target for fluid catch-up
      current.current.x += (target.current.x - current.current.x) * SMOOTHING;
      current.current.y += (target.current.y - current.current.y) * SMOOTHING;

      setPoints((prev) => {
        const newPoints = [...prev, { x: current.current.x, y: current.current.y }];
        return newPoints.length > MAX_POINTS ? newPoints.slice(-MAX_POINTS) : newPoints;
      });

      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const pathData = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  return (
    <svg className="pointer-events-none fixed top-0 left-0 z-0 w-full h-full">
      <defs>
        <filter id="etherealGlow">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.1
                    0 1 1 0 0.2
                    0 1 1 0 0.3
                    0 0 0 0.15 0"
            result="glow"
          />
          <feBlend in="SourceGraphic" in2="glow" mode="screen" />
        </filter>
      </defs>

      <path
        d={pathData}
        fill="none"
        stroke="hsl(185, 100%, 70%)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#etherealGlow)"
        opacity="0.1"
      />
    </svg>
  );
}
