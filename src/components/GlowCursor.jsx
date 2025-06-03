import React, { useEffect, useRef, useState } from "react";

export default function GlowCursor() {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [target, setTarget] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [velocity, setVelocity] = useState(0);
  const [hue, setHue] = useState(180);
  const requestRef = useRef();

  useEffect(() => {
    const animate = () => {
      const dx = target.x - position.x;
      const dy = target.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const easing = 0.15;
      const newX = position.x + dx * easing;
      const newY = position.y + dy * easing;

      setPosition({ x: newX, y: newY });
      setVelocity(distance * 0.3); // motion effect

      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [position, target]);

  useEffect(() => {
    const move = (e) => {
      const x = e.touches?.[0]?.clientX || e.clientX;
      const y = e.touches?.[0]?.clientY || e.clientY;
      setTarget({ x, y });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
    };
  }, []);

  useEffect(() => {
    const colorCycle = setInterval(() => {
      setHue((prev) => (prev >= 210 ? 180 : prev + 1));
    }, 80);
    return () => clearInterval(colorCycle);
  }, []);

  const stretch = Math.min(velocity * 0.5, 40);
  const width = 50 + stretch;
  const height = 50 - stretch * 0.3;
  const opacity = Math.min(0.18 + velocity * 0.004, 0.28);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-0"
      style={{
        width,
        height,
        transform: `translate(${position.x - width / 2}px, ${position.y - height / 2}px)`,
        borderRadius: "50%",
        background: `radial-gradient(circle, hsla(${hue}, 100%, 70%, ${opacity}), transparent 65%)`,
        mixBlendMode: "screen",
        filter: "blur(14px) contrast(120%)",
        transition: "background 0.15s ease",
        willChange: "transform, background, width, height",
      }}
    />
  );
}

