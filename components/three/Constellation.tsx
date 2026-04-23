"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";

type Star = { pos: [number, number, number]; label?: string; caption?: string };

// Star positions forming a rough outline spelling an approximation — using constellation shape
const STARS: Star[] = [
  { pos: [-7, 2.5, 0], label: "jun 15", caption: "the first yes. rained. ignored it." },
  { pos: [-5, 3.8, -1], label: "first call", caption: "3 hrs felt like 5 min." },
  { pos: [-3, 2.2, 0.5], label: "dakshinchitra", caption: "the tape 👀 never speak of it." },
  { pos: [-1, 4.2, 0], label: "chikmagalur", caption: "those stairs. coffee mist." },
  { pos: [1, 2.5, -0.6], label: "aishu", caption: "every time i say it." },
  { pos: [3, 3.8, 0], label: "chungi", caption: "my favourite sound." },
  { pos: [5, 2.5, -1], label: "first fight", caption: "and the first apology." },
  { pos: [7, 3, 0], label: "forever", caption: "working on it." },
  { pos: [-6, -1.8, 0.3], label: "us", caption: "the shorthand." },
  { pos: [-4, -3.2, 0.5], label: "long calls", caption: "silences and all." },
  { pos: [-1.5, -1.8, -1], label: "first trip", caption: "u packed 4 books." },
  { pos: [0.5, -3.5, 0], label: "your laugh", caption: "reliable jpeg in my head." },
  { pos: [2.5, -2, 0.5], label: "valentine", caption: "boring date, spectacular u." },
  { pos: [4.5, -3.5, 0], label: "21", caption: "it suits u. obvs." },
  { pos: [6, -1.8, 0.5], label: "today", caption: "the internet on mute." },
];

const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  [0, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [7, 14],
  [3, 10], [2, 9], [4, 11], [5, 12], [6, 13],
];

function StarPoint({ s, index, onHover }: { s: Star; index: number; onHover: (i: number | null) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + index * 0.3;
    ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
  });
  return (
    <mesh
      ref={ref}
      position={s.pos}
      onPointerOver={(e) => { e.stopPropagation(); onHover(index); }}
      onPointerOut={() => onHover(null)}
      onClick={(e) => { e.stopPropagation(); onHover(index); }}
    >
      <sphereGeometry args={[0.14, 16, 16]} />
      <meshBasicMaterial color="#fff" toneMapped={false} />
    </mesh>
  );
}

function Scene({ hovered, setHovered }: { hovered: number | null; setHovered: (i: number | null) => void }) {
  useFrame((state) => {
    const { mouse } = state;
    state.camera.position.x += (mouse.x * 1.5 - state.camera.position.x) * 0.03;
    state.camera.position.y += (mouse.y * 0.8 + 0.5 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Background far stars */}
      <BackgroundStars />

      {/* Lines */}
      {LINKS.map(([a, b], i) => (
        <Line
          key={i}
          points={[STARS[a].pos, STARS[b].pos]}
          color="#ffbfd1"
          lineWidth={0.6}
          transparent
          opacity={0.35}
        />
      ))}

      {/* Stars */}
      {STARS.map((s, i) => (
        <StarPoint key={i} s={s} index={i} onHover={setHovered} />
      ))}

      {/* Label */}
      {hovered !== null && STARS[hovered].label && (
        <Html position={STARS[hovered].pos} center distanceFactor={10}>
          <div className="pointer-events-none -translate-y-10 whitespace-nowrap">
            <div className="rounded-full px-3 py-1 bg-black/80 hair-dark text-[10px] uppercase tracking-[0.3em] text-white/90">
              {STARS[hovered].label}
            </div>
            {STARS[hovered].caption && (
              <div className="mt-2 text-xs text-white/60 text-center">
                {STARS[hovered].caption}
              </div>
            )}
          </div>
        </Html>
      )}
    </>
  );
}

function BackgroundStars() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function ConstellationCanvas() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <Canvas camera={{ position: [0, 0, 14], fov: 50 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
      <color attach="background" args={["#030308"]} />
      <ambientLight intensity={0.4} />
      <Scene hovered={hovered} setHovered={setHovered} />
    </Canvas>
  );
}
