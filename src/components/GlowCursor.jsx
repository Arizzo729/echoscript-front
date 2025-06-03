import React, { useEffect, useRef, useState } from "react";

export default function GlowCursor() {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [target, setTarget] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [hue, setHue] = useState(165);
  const [pulse, setPulse] = useState(0);
  const [angle, setAngle] = useState(0);
  const [stretch, setStretch] = useState(1);
  const lastPosition = useRef(position);
  const requestRef = useRef();

  useEffect(() => {
    const animate = () => {
      const dx = target.x - position.x;
      const dy = target.y - position.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const angleRad = Math.atan2(dy, dx);
      const stretchFactor = 1 + Math.min(speed / 40, 1.5); // stretch max 1.5x

      setPosition((prev) => ({
        x: prev.x + dx * 0.12,
        y: prev.y + dy * 0.12,
      }));

      setAngle(angleRad * (180 / Math.PI));
      setStretch(stretchFactor);
      setPulse(Math.sin(Date.now() / 300) * 6);

      lastPosition.current = position;
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [position, target]);

  useEffect(() => {
    const update = (e) => {
      const clientX = e.touches?.[0]?.clientX || e.clientX;
      const clientY = e.touches?.[0]?.clientY || e.clientY;
      setTarget({ x: clientX, y: clientY });
    };
    window.addEventListener("mousemove", update);
    window.addEventListener("touchmove", update);
    return () => {
      window.removeEventListener("mousemove", update);
      window.removeEventListener("touchmove", update);
    };
  }, []);

  useEffect(() => {
    const hueInterval = setInterval(() => {
      setHue((prev) => (prev >= 200 ? 165 : prev + 1));
    }, 80);
    return () => clearInterval(hueInterval);
  }, []);

  const baseSize = 70 + pulse;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-0 transition duration-75 ease-out"
      style={{
        width: `${baseSize}px`,
        height: `${baseSize * stretch}px`,
        transform: `translate(${position.x - baseSize / 2}px, ${
          position.y - (baseSize * stretch) / 2
        }px) rotate(${angle}deg)`,
        borderRadius: "50%",
        background: `radial-gradient(circle, hsla(${hue}, 100%, 72%, 0.12), transparent 70%)`,
        mixBlendMode: "screen",
        filter: "blur(18px)",
        willChange: "transform, width, height, background",
      }}
    />
  );
}
