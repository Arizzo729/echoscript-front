// src/components/GlowRibbon.jsx
import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, Color } from "three";
import { Line } from "@react-three/drei";

const TRAIL_LENGTH = 20;
const EASING = 0.15;
const WOBBLE_INTENSITY = 0.03;

export default function GlowRibbon() {
  const mouse = useRef(new Vector3(0, 0, 0));
  const points = useRef(Array.from({ length: TRAIL_LENGTH }, () => new Vector3()));
  const lineRef = useRef();

  const [tick, setTick] = useState(0);

  const baseColor = new Color("#00f0ff");

  useFrame(({ pointer }) => {
    // Ease mouse movement with a bit of wobble
    const target = new Vector3(pointer.x * 5, pointer.y * 5, 0);
    mouse.current.lerp(target, EASING);
    mouse.current.x += Math.sin(tick / 15) * WOBBLE_INTENSITY;
    mouse.current.y += Math.cos(tick / 20) * WOBBLE_INTENSITY;

    // Shift trail points
    points.current.shift();
    points.current.push(mouse.current.clone());

    // Smooth curve
    const curve = new CatmullRomCurve3(points.current);
    const trailPoints = curve.getPoints(80);

    // Update trail path
    if (lineRef.current) {
      lineRef.current.setPoints(trailPoints);
    }

    // Slight color shimmer over time
    const hue = (tick % 360) / 360;
    const shimmer = baseColor.clone().offsetHSL(hue * 0.15, 0, 0);
    if (lineRef.current) {
      lineRef.current.material.color = shimmer;
    }

    setTick(tick + 1);
  });

  return (
    <Line
      ref={lineRef}
      lineWidth={3}
      transparent
      opacity={0.08}
      color={"#00f0ff"}
      toneMapped={false}
    />
  );
}
