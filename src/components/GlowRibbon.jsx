// ✅ src/components/GlowCanvas.jsx — 3D Ribbon Glow Cursor using Three.js
import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RibbonTrail = () => {
  const trailRef = useRef();
  const mouse = useRef(new THREE.Vector2());
  const points = useRef([]);
  const maxPoints = 80;

  useEffect(() => {
    const updateMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", updateMouse);
    return () => window.removeEventListener("pointermove", updateMouse);
  }, []);

  const curveMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.4,
      }),
    []
  );

  useFrame(({ camera }) => {
    const vec = new THREE.Vector3(mouse.current.x, mouse.current.y, 0.5);
    vec.unproject(camera);
    points.current.push(vec.clone());
    if (points.current.length > maxPoints) points.current.shift();

    if (trailRef.current && points.current.length > 2) {
      const curve = new THREE.CatmullRomCurve3(points.current);
      const geometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
      trailRef.current.geometry.dispose();
      trailRef.current.geometry = geometry;
    }
  });

  return (
    <mesh ref={trailRef}>
      <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0)]), 64, 0.05, 8, false]} />
      <meshBasicMaterial
        attach="material"
        color={new THREE.Color("#00fff7")}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default function GlowCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <RibbonTrail />
      </Canvas>
    </div>
  );
}

