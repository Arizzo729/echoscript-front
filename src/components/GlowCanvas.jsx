// src/components/GlowCanvas.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import GlowRibbon from "./GlowRibbon";

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
      <Suspense fallback={null}>
        {/* 🌈 The glowing trail */}
        <GlowRibbon />

        {/* ✨ Bloom glow effect */}
        <EffectComposer disableNormalPass>
          <Bloom
            intensity={0.4}         // brightness
            luminanceThreshold={0}  // always bloom
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
