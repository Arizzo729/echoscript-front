import React, { useEffect, useRef } from "react";

export default function GlowCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const position = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const velocity = useRef({ x: 0, y: 0 });
  const hue = useRef(180);
  const rafId = useRef(null);

  useEffect(() => {
    const updateMouse = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      target.current = { x, y };
    };

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("touchmove", updateMouse);

    const animate = () => {
      const dx = target.current.x - position.current.x;
      const dy = target.current.y - position.current.y;

      velocity.current.x += dx * 0.07;
      velocity.current.y += dy * 0.07;

      velocity.current.x *= 0.65;
      velocity.current.y *= 0.65;

      position.current.x += velocity.current.x;
      position.current.y += velocity.current.y;

      hue.current = (hue.current + 0.4) % 360;

      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
      const scaleX = 1 + Math.min(speed / 14, 1.8);
      const scaleY = 1 - Math.min(speed / 30, 0.25);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${position.current.x - 40}px, ${position.current.y - 40}px) scale(${scaleX}, ${scaleY})`;
        cursorRef.current.style.background = `radial-gradient(circle, hsla(${hue.current}, 100%, 70%, 0.14), transparent 60%)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${position.current.x - 40}px, ${position.current.y - 40}px) scale(${1.3}, ${1.3})`;
        trailRef.current.style.background = `radial-gradient(circle, hsla(${(hue.current + 40) % 360}, 100%, 60%, 0.05), transparent 70%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("touchmove", updateMouse);
    };
  }, []);

  return (
    <>
      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-0"
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          filter: "blur(40px)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-0"
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          filter: "blur(20px)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

