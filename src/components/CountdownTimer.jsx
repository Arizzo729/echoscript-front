// components/CountdownTimer.jsx
import React, { useEffect, useState } from "react";

export default function CountdownTimer({ seconds = 3, onComplete }) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <div className="text-6xl font-bold text-white animate-pulse">
        {count}
      </div>
    </div>
  );
}
