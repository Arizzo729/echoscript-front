import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, Color } from "three";
import { Line } from "@react-three/drei";

const TRAIL_LENGTH = 20;
const EASING = 0.15;

export default function GlowRibbon() {
  const mouse = useRef(new Vector3(0, 0, 0));
  const pointsRef = useRef(Array.from({ length: TRAIL_LENGTH }, () => new Vector3()));
  const lineRef = useRef();
  const [tick, setTick] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const baseColor = new Color("#00f0ff");

  // Delay init 1 frame to avoid reading undefined points during Drei init
  useEffect(() => {
    requestAnimationFrame(() => setInitialized(true));
  }, []);

  useFrame(({ pointer }) => {
    const target = new Vector3(pointer.x * 10, pointer.y * 10, 0);
    mouse.current.lerp(target, EASING);

    pointsRef.current.shift();
    pointsRef.current.push(mouse.current.clone());

    if (!initialized || !lineRef.current) return;

    const curve = new CatmullRomCurve3(pointsRef.current);
    const trailPoints = curve.getPoints(80);

    if (Array.isArray(trailPoints) && trailPoints.length > 0 && typeof lineRef.current.setPoints === "function") {
      lineRef.current.setPoints(trailPoints);

      const shimmer = baseColor.clone().offsetHSL(((tick % 360) / 360) * 0.1, 0, 0);
      if (lineRef.current.material) {
        lineRef.current.material.color = shimmer;
      }
    }

    setTick((t) => t + 1);
  });

  if (!initialized) return null;

  return (
    <Line
      ref={lineRef}
      points={pointsRef.current}
      lineWidth={3}
      transparent
      opacity={0.08}
      color={"#00f0ff"}
      toneMapped={false}
    />
  );
}


