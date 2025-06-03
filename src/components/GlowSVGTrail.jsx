import React, { useRef, useState, useEffect } from "react";

const MAX_POINTS = 20;
const SMOOTHING = 0.18;

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
      current.current.x += (target.current.x - current.current.x) * SMOOTHING;
      current.current.y += (target.current.y - current.current.y) * SMOOTHING;

      setPoints((prev) => {
        const next = [...prev, { ...current.current }];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      });

      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const getPathData = (pts) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i].x + pts[i + 1].x) / 2;
      const yc = (pts[i].y + pts[i + 1].y) / 2;
      d += ` Q ${pts[i].x},${pts[i].y} ${xc},${yc}`;
    }
    return d;
  };

  const pathData = getPathData(points);

  return (
    <svg className="pointer-events-none fixed top-0 left-0 z-0 w-full h-full">
      <defs>
        <linearGradient id="tealGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0, 255, 255, 0.15)" />
          <stop offset="100%" stopColor="rgba(0, 200, 255, 0.05)" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="24" />
        </filter>
      </defs>

      <path
        d={pathData}
        fill="none"
        stroke="url(#tealGlow)"
        strokeWidth="22"
        filter="url(#blur)"
        opacity="0.07"
        strokeLinecap="round"
      />
    </svg>
  );
}
