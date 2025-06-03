import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, Color } from "three";
import { Line } from "@react-three/drei";

const TRAIL_LENGTH = 20;
const EASING = 0.15;

export default function GlowRibbon() {
  const mouse = useRef(new Vector3(0, 0, 0));
  const points = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => new Vector3(0, 0, 0))
  );
  const lineRef = useRef();
  const [tick, setTick] = useState(0);
  const baseColor = useMemo(() => new Color("#00f0ff"), []);

  useFrame(({ pointer }) => {
    const target = new Vector3(pointer.x * 10, pointer.y * 10, 0);
    mouse.current.lerp(target, EASING);

    points.current.shift();
    points.current.push(mouse.current.clone());

    const curve = new CatmullRomCurve3(points.current);
    const trailPoints = curve.getPoints(80);

    if (lineRef.current && trailPoints?.length > 0) {
      try {
        lineRef.current.setPoints(trailPoints);
        const shimmer = baseColor
          .clone()
          .offsetHSL(((tick % 360) / 360) * 0.1, 0, 0);
        if (lineRef.current.material?.color) {
          lineRef.current.material.color = shimmer;
        }
      } catch (e) {
        console.error("GlowRibbon update error:", e);
      }
    }

    setTick((prev) => prev + 1);
  });

  return (
    <Line
      ref={lineRef}
      points={points.current}
      lineWidth={3}
      transparent
      opacity={0.08}
      color={"#00f0ff"}
      toneMapped={false}
    />
  );
}

