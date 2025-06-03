import React, { useEffect, useRef } from "react";

export default function GlowRibbonCursor() {
  const canvasRef = useRef(null);
  const points = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const maxPoints = 40;

    const addPoint = (x, y) => {
      points.current.push({ x, y });
      if (points.current.length > maxPoints) {
        points.current.shift();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      for (let i = 0; i < points.current.length - 1; i++) {
        const p = points.current[i];
        const next = points.current[i + 1];
        ctx.strokeStyle = `hsla(185, 100%, 65%, ${i / maxPoints})`;
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    };

    draw();

    const move = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      addPoint(x, y);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 z-0"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}

