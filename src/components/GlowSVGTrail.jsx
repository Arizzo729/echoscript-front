import React, { useEffect, useRef, useState } from "react";

const MAX_POINTS = 8;
const EASING = 0.25;

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
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * EASING;
      current.current.y += (target.current.y - current.current.y) * EASING;

      setTrail((prev) => {
        const next = [...prev, { ...current.current }];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      });

      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const getCatmullRomPath = (points) => {
    if (points.length < 4) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 2; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2];
      const xc1 = (p2.x - p0.x) / 6 + p1.x;
      const yc1 = (p2.y - p0.y) / 6 + p1.y;
      const xc2 = (p3.x - p1.x) / -6 + p2.x;
      const yc2 = (p3.y - p1.y) / -6 + p2.y;
      d += ` C ${xc1},${yc1} ${xc2},${yc2} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const pathData = getCatmullRomPath(trail);

  return (
    <svg className="pointer-events-none fixed top-0 left-0 z-0 w-full h-full">
      <defs>
        <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(0,200,255,0.06)" />
        </linearGradient>
        <filter id="soft-glow">
          <feGaussianBlur stdDeviation="35" />
        </filter>
      </defs>

      <path
        d={pathData}
        fill="none"
        stroke="url(#glow-gradient)"
        strokeWidth="42"
        filter="url(#soft-glow)"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.07"
      />
    </svg>
  );
}


