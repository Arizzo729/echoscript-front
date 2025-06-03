import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BAR_COUNT = 20;
const MAX_HEIGHT = 60;

export default function AIWaveform({ className = "" }) {
  const [heights, setHeights] = useState(() =>
    Array.from({ length: BAR_COUNT }, () => Math.random() * MAX_HEIGHT)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: BAR_COUNT }, () =>
          Math.max(10, Math.random() * MAX_HEIGHT)
        )
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const safeHeights = Array.isArray(heights) ? heights : [];

  return (
    <div
      className={`w-full h-24 flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${BAR_COUNT * 10} 100`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {safeHeights.map((height, index) => (
          <motion.rect
            key={index}
            x={index * 10}
            y={100 - height}
            width="6"
            height={height}
            rx="2"
            fill="url(#waveGradient)"
            filter="url(#glow)"
            animate={{ height: [height, height * 0.6, height] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.03,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

