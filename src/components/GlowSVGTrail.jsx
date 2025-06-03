import React, { useEffect, useRef, useState } from "react";

const MAX_POINTS = 30;

export default function GlowSVGTrail() {
  const [points, setPoints] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    const update = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;

      setPoints((prev) => {
        const newPoints = [...prev, { x, y }];
        return newPoints.length > MAX_POINTS ? newPoints.slice(-MAX_POINTS) : newPoints;
      });
    };

    window.addEventListener("mousemove", update);
    window.addEventListener("touchmove", update);
    return () => {
      window.removeEventListener("mousemove", update);
      window.removeEventListener("touchmove", update);
    };
  }, []);

  const pathData = points
    .map((p, i) =>
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    )
    .join(" ");

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none fixed top-0 left-0 z-0 w-full h-full"
      width="100%"
      height="100%"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feColorMatrix
            result="tealBlur"
            type="matrix"
            values="0 0 0 0 0.0
                    0 1 1 0 0.7
                    0 0 0 0 0.8
                    0 0 0 0.4 0"
          />
          <feBlend in="SourceGraphic" in2="tealBlur" mode="screen" />
        </filter>
      </defs>

      <path
        d={pathData}
        fill="none"
        stroke="hsl(185, 100%, 70%)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
    </svg>
  );
}
