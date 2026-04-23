"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function VinylRecord({ spinning = true }: { spinning?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spinning && ref.current) ref.current.rotation.y += dt * 1.2;
  });

  return (
    <group ref={ref} rotation={[-0.4, 0, 0]}>
      {/* Record */}
      <mesh>
        <cylinderGeometry args={[2, 2, 0.05, 64]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Grooves via rings */}
      {[0.4, 0.7, 1.0, 1.3, 1.6, 1.9].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.026, 0]}>
          <ringGeometry args={[r, r + 0.002, 64]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Label center */}
      <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 48]} />
        <meshStandardMaterial color="#ff4d6d" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 24]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
    </group>
  );
}
