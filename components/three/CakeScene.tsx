"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CakeScene({ blownOut, count = 21 }: { blownOut: boolean; count?: number }) {
  return (
    <group position={[0, -1.2, 0]}>
      {/* Bottom tier */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.8, 64]} />
        <meshStandardMaterial color="#f7d8dd" roughness={0.6} />
      </mesh>
      {/* Mid tier */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.7, 64]} />
        <meshStandardMaterial color="#fff2de" roughness={0.5} />
      </mesh>
      {/* Top tier */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.6, 64]} />
        <meshStandardMaterial color="#ffe0e0" roughness={0.5} />
      </mesh>

      {/* Frosting drip (torus) */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.08, 12, 64]} />
        <meshStandardMaterial color="#ff8ea0" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.06, 12, 64]} />
        <meshStandardMaterial color="#ff8ea0" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.05, 12, 64]} />
        <meshStandardMaterial color="#ff8ea0" roughness={0.4} />
      </mesh>

      {/* Candles in a ring on top tier */}
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const r = 0.6;
        return (
          <Candle
            key={i}
            pos={[Math.cos(angle) * r, 1.9, Math.sin(angle) * r]}
            index={i}
            blownOut={blownOut}
          />
        );
      })}
    </group>
  );
}

function Candle({ pos, index, blownOut }: { pos: [number, number, number]; index: number; blownOut: boolean }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!flameRef.current) return;
    const t = state.clock.elapsedTime + index * 0.7;
    const flicker = 0.9 + Math.sin(t * 12) * 0.1 + Math.random() * 0.05;
    flameRef.current.scale.set(flicker, 1 + Math.sin(t * 8) * 0.15, flicker);
    if (lightRef.current) {
      lightRef.current.intensity = blownOut ? 0 : 0.4 * flicker;
    }
  });

  return (
    <group position={pos}>
      {/* Wax stick */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
        <meshStandardMaterial color="#2a1a0a" />
      </mesh>
      {/* Flame */}
      {!blownOut && (
        <>
          <mesh ref={flameRef} position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ffd27a" toneMapped={false} />
          </mesh>
          <pointLight ref={lightRef} position={[0, 0.42, 0]} intensity={0.4} color="#ffbc6a" distance={2} decay={2} />
        </>
      )}
      {/* Smoke when blown */}
      {blownOut && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#555" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
