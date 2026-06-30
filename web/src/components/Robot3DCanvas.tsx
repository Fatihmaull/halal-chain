"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { Mesh, Group } from "three";

/* ─── Robot 3D Mesh ──────────────────────────── */
function RobotMesh({ action = "wave" }: { action?: string }) {
  const groupRef = useRef<Group>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);
  const eyeLeftRef = useRef<Mesh>(null);
  const eyeRightRef = useRef<Mesh>(null);
  const chestLightRef = useRef<Mesh>(null);
  const t = useRef(0);

  const brandGreen = "#1a7a4a";
  const brandGreenDark = "#155c38";
  const accent = "#d97706";

  useFrame((state, delta) => {
    t.current += delta;
    const time = t.current;

    if (!groupRef.current) return;

    // Base float
    groupRef.current.position.y = Math.sin(time * 1.2) * 0.05;
    groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.08;

    if (action === "wave" && leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.PI * 0.15 + Math.sin(time * 4) * 0.5;
    }
    if (action === "nod" && headRef.current) {
      headRef.current.rotation.x = Math.sin(time * 3) * 0.15;
    }
    if (action === "celebrate") {
      if (leftArmRef.current) leftArmRef.current.rotation.z = Math.PI * 0.3 + Math.sin(time * 5) * 0.4;
      if (rightArmRef.current) rightArmRef.current.rotation.z = -(Math.PI * 0.3 + Math.sin(time * 5 + Math.PI) * 0.4);
      if (groupRef.current) groupRef.current.rotation.y = time * 0.8;
    }
    if (action === "spin" && groupRef.current) {
      groupRef.current.rotation.y = time * 2;
    }
    if (action === "point" && rightArmRef.current) {
      rightArmRef.current.rotation.z = -Math.PI * 0.45;
      rightArmRef.current.rotation.x = Math.sin(time * 2) * 0.1;
    }

    // Chest light pulse
    if (chestLightRef.current) {
      const mat = chestLightRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(time * 2.5) * 0.3;
    }

    // Eye blink
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkPhase = Math.floor(time / 3) % 1;
      const blink = Math.abs(Math.sin(time * 8)) > 0.97 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = blink;
      eyeRightRef.current.scale.y = blink;
    }
  });

  return (
    <group ref={groupRef} scale={0.85}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.70, 0.55, 0.55]} />
        <meshStandardMaterial color={brandGreen} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Antenna base */}
      <mesh position={[0, 0.96, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.18, 8]} />
        <meshStandardMaterial color={brandGreenDark} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Antenna ball */}
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} roughness={0.1} />
      </mesh>

      {/* Eyes */}
      <mesh ref={eyeLeftRef} position={[-0.18, 0.70, 0.28]}>
        <boxGeometry args={[0.14, 0.10, 0.04]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.18, 0.70, 0.28]}>
        <boxGeometry args={[0.14, 0.10, 0.04]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.18, 0.70, 0.31]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#0a2e1a" roughness={0.1} />
      </mesh>
      <mesh position={[0.18, 0.70, 0.31]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#0a2e1a" roughness={0.1} />
      </mesh>

      {/* Mouth — curved via torus segment */}
      <mesh position={[0, 0.57, 0.28]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.10, 0.018, 6, 16, Math.PI * 0.6]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.0, 0]} castShadow>
        <boxGeometry args={[0.80, 0.72, 0.56]} />
        <meshStandardMaterial color={brandGreenDark} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Chest panel */}
      <mesh position={[0, 0.05, 0.29]}>
        <boxGeometry args={[0.38, 0.34, 0.04]} />
        <meshStandardMaterial color={brandGreen} roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Chest light */}
      <mesh ref={chestLightRef} position={[0, 0.05, 0.33]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.0}
          roughness={0.05}
          metalness={0.2}
        />
      </mesh>

      {/* Chest panel dots */}
      {[-0.10, 0.10].map((x, i) => (
        <mesh key={i} position={[x, -0.05, 0.33]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color={brandGreen} emissive={brandGreen} emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* Left arm */}
      <mesh
        ref={leftArmRef}
        position={[-0.52, 0.12, 0]}
        rotation={[0, 0, Math.PI * 0.15]}
      >
        <capsuleGeometry args={[0.085, 0.40, 4, 8]} />
        <meshStandardMaterial color={brandGreen} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Right arm */}
      <mesh
        ref={rightArmRef}
        position={[0.52, 0.12, 0]}
        rotation={[0, 0, -Math.PI * 0.08]}
      >
        <capsuleGeometry args={[0.085, 0.40, 4, 8]} />
        <meshStandardMaterial color={brandGreen} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.22, -0.52, 0]}>
        <capsuleGeometry args={[0.09, 0.30, 4, 8]} />
        <meshStandardMaterial color={brandGreenDark} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.22, -0.52, 0]}>
        <capsuleGeometry args={[0.09, 0.30, 4, 8]} />
        <meshStandardMaterial color={brandGreenDark} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.22, -0.75, 0.04]}>
        <boxGeometry args={[0.20, 0.08, 0.28]} />
        <meshStandardMaterial color={brandGreenDark} roughness={0.6} />
      </mesh>
      <mesh position={[0.22, -0.75, 0.04]}>
        <boxGeometry args={[0.20, 0.08, 0.28]} />
        <meshStandardMaterial color={brandGreenDark} roughness={0.6} />
      </mesh>

      {/* Shadow / base */}
      <mesh position={[0, -0.82, 0]} receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.01, 24]} />
        <meshStandardMaterial color={brandGreen} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

/* ─── Canvas wrapper ─────────────────────────── */
export default function Robot3DCanvas({ action }: { action?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 2.8], fov: 38 }}
      shadows={false}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 3]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-2, 1, -1]} intensity={0.4} color="#a8f0c8" />
      <pointLight position={[0, 2, 2]} intensity={0.6} color="#d97706" />

      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
        <RobotMesh action={action} />
      </Float>

      <Environment preset="city" />
    </Canvas>
  );
}
