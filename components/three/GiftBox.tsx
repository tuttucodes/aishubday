"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function GiftBox({ progress }: { progress: number }) {
  // progress 0 = closed, 1 = fully opened
  const lidRef = useRef<THREE.Group>(null);
  const ribbonRef = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (lidRef.current) {
      lidRef.current.rotation.x = -progress * Math.PI * 0.55;
      lidRef.current.position.y = 1.1 + progress * 0.4;
      lidRef.current.position.z = -progress * 0.8;
    }
    if (ribbonRef.current) {
      ribbonRef.current.scale.y = 1 - progress * 0.9;
      ribbonRef.current.scale.x = 1 - progress * 0.9;
    }
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={boxRef}>
      {/* Box body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#c8455a" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Box wrapped stripes */}
      <mesh position={[0, 0.5, 1.001]} scale={[0.2, 1, 1]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color="#ffd9a0" />
      </mesh>
      <mesh position={[0, 0.5, -1.001]} rotation={[0, Math.PI, 0]} scale={[0.2, 1, 1]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color="#ffd9a0" />
      </mesh>
      <mesh position={[1.001, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.2, 1, 1]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color="#ffd9a0" />
      </mesh>
      <mesh position={[-1.001, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[0.2, 1, 1]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color="#ffd9a0" />
      </mesh>

      {/* Lid */}
      <group ref={lidRef} position={[0, 1.1, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[2.15, 0.25, 2.15]} />
          <meshStandardMaterial color="#a33246" roughness={0.4} metalness={0.15} />
        </mesh>
      </group>

      {/* Ribbon bow */}
      <group ref={ribbonRef} position={[0, 1.35, 0]}>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[0.35, 0.08, 12, 32, Math.PI]} />
          <meshStandardMaterial color="#ffd9a0" roughness={0.5} />
        </mesh>
        <mesh rotation={[0, -Math.PI / 4, 0]}>
          <torusGeometry args={[0.35, 0.08, 12, 32, Math.PI]} />
          <meshStandardMaterial color="#ffd9a0" roughness={0.5} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#ffd9a0" roughness={0.4} />
        </mesh>
      </group>

      {/* Glow from inside when opening */}
      {progress > 0.2 && (
        <pointLight position={[0, 1.3, 0]} intensity={progress * 4} color="#ffd9a0" distance={3} />
      )}

      {/* Sparkle geometry inside */}
      {progress > 0.4 && (
        <mesh position={[0, 1.4 + progress * 0.4, 0]} scale={progress}>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            color="#ffd9a0"
            emissive="#ffd9a0"
            emissiveIntensity={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
