// src/components/GlowCanvas.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import GlowRibbon from "./GlowRibbon";

export default function GlowCanvas() {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 100, position: [0, 0, 100] }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <GlowRibbon />
    </Canvas>
  );
}
