import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GlowRibbon() {
  const trailRef = useRef();
  const points = useRef([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.01, 0.01, 0.01),
    new THREE.Vector3(0.02, 0.02, 0.02),
  ]);
  const maxPoints = 80;
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const updateMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", updateMouse);
    return () => window.removeEventListener("pointermove", updateMouse);
  }, []);

  useFrame(({ camera }) => {
    const vec = new THREE.Vector3(mouse.current.x, mouse.current.y, 0.5);
    vec.unproject(camera);
    points.current.push(vec.clone());
    if (points.current.length > maxPoints) points.current.shift();

    if (trailRef.current) {
      const validPoints = points.current.filter((p) => p && p.isVector3);
      if (validPoints.length > 2) {
        const curve = new THREE.CatmullRomCurve3(validPoints);
        const geometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
        if (trailRef.current.geometry) trailRef.current.geometry.dispose();
        trailRef.current.geometry = geometry;
      }
    }
  });

  return (
    <mesh ref={trailRef}>
      <tubeGeometry
        args={[
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.01, 0.01, 0.01),
            new THREE.Vector3(0.02, 0.02, 0.02),
          ]),
          64,
          0.05,
          8,
          false,
        ]}
      />
      <meshBasicMaterial
        attach="material"
        color={new THREE.Color("#14f1f9")}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}



