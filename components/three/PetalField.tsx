"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 1200;

export function PetalField({ color = "#ffbfd1" }: { color?: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petals = useMemo(() => {
    const arr: { x: number; y: number; z: number; vy: number; vr: number; scale: number; phase: number }[] = [];
    for (let i = 0; i < COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 30,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 20,
        vy: 0.01 + Math.random() * 0.02,
        vr: (Math.random() - 0.5) * 0.02,
        scale: 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!meshRef.current) return;
    petals.forEach((p, i) => {
      p.y -= p.vy;
      if (p.y < -10) p.y = 12;
      const swayX = Math.sin(t * 0.5 + p.phase) * 0.6;
      dummy.position.set(p.x + swayX, p.y, p.z);
      dummy.rotation.set(t * p.vr * 5, t * p.vr * 3, t * 0.2 + p.phase);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <planeGeometry args={[1, 1.4]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  );
}
