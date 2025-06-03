import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import GlowRibbon from "./GlowRibbon"; // ensure this is still valid

export default function GlowCanvas() {
  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      camera={{ zoom: 100, position: [0, 0, 100] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <ambientLight intensity={1.2} />
      <Suspense fallback={null}>
        <GlowRibbon />
      </Suspense>
    </Canvas>
  );
}
