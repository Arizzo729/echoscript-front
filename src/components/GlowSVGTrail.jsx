import React, { useEffect, useRef, useState } from "react";

const MAX_POINTS = 12;
const EASING = 0.2;

export default function GlowSVGTrail() {
  const [trail, setTrail] = useState([]);
  const current = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX || e.touches?.[0]?.clientX;
      const y = e.clientY || e.touches?.[0]?.clientY;
      target.current = { x, y };
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      current.current.x += (target.current.x - current.current.x) * EASING;
      current.current.y += (target.current.y - current.current.y) * EASING;

      setTrail((prev) => {
        const next = [...prev, { ...current.current }];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      });

      requestAnimationFrame(update);
    };
    update();
  }, []);

  const path = trail.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const xc = (prev.x + point.x) / 2;
    const yc = (prev.y + point.y) / 2;
    return acc + ` Q ${prev.x},${prev.y} ${xc},${yc}`;
  }, "");

  return (
    <svg className="pointer-events-none fixed top-0 left-0 w-full h-full z-0">
      <defs>
        <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(0,200,255,0.15)" />
        </linearGradient>
        <filter id="blurFilter">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>

      <path
        d={path}
        fill="none"
        stroke="url(#glow-gradient)"
        strokeWidth="26"
        filter="url(#blurFilter)"
        opacity="0.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

