import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const BAR_COUNT = 24;
const MAX_HEIGHT = 64;

export default function AIWaveform({ className = "" }) {
  const [heights, setHeights] = useState(
    Array.from({ length: BAR_COUNT }, () => Math.random() * MAX_HEIGHT)
  );

  const animationRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      setHeights((prev) =>
        prev.map((_, i) => {
          const wave = Math.sin(Date.now() / 350 + i * 0.5) * 12;
          const noise = Math.random() * 8;
          const h = Math.max(8, Math.min(MAX_HEIGHT, wave + noise + MAX_HEIGHT / 2));
          return h;
        })
      );
    };

    animationRef.current = setInterval(animate, 180);
    return () => clearInterval(animationRef.current);
  }, []);

  return (
    <div
      className={`w-full h-24 flex items-center justify-center ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <svg
        viewBox={`0 0 ${BAR_COUNT * 10} 100`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {heights.map((h, i) => (
          <motion.rect
            key={i}
            x={i * 10}
            y={100 - h}
            width="6"
            height={h}
            rx="3"
            fill="url(#waveGradient)"
            filter="url(#glow)"
            animate={{ height: [h, h * 0.85, h] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.02,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

