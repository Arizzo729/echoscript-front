// src/components/Spinner.jsx
import React from "react";

export default function Spinner({ size = 5, className = "" }) {
  const dimension = `h-${size} w-${size}`;

  return (
    <svg
      className={`text-teal-500 ${dimension} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="spinner-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="url(#spinner-gradient)"
        strokeWidth="10"
        fill="none"
        strokeDasharray="220"
        strokeDashoffset="180"
        strokeLinecap="round"
        className="animate-[dashSpin_1.4s_ease-in-out_infinite]"
      />
    </svg>
  );
}
