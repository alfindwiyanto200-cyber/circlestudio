"use client";

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Reusable THREE objects to avoid per-frame allocations (memory leak fix)
const _vec2Pointer = new THREE.Vector2();
const _vec2Disc = new THREE.Vector2();
const _vec3Scale = new THREE.Vector3();

function GlassDisc({ position, index }: { position: [number, number, number], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const [baseRotation] = React.useState(() => [
    Math.random() * Math.PI,
    (Math.random() - 0.5) * 0.8,
    (Math.random() - 0.5) * 0.8
  ]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const targetX = state.pointer.x * 3;
    const targetY = state.pointer.y * 3;

    // Reuse pre-allocated objects — no new() every frame
    _vec2Pointer.set(state.pointer.x * 12, state.pointer.y * 8);
    _vec2Disc.set(position[0], position[1]);
    const distance = _vec2Pointer.distanceTo(_vec2Disc);

    // Hover scale spring
    const hoverScale = distance < 3 ? 1.15 : 1;
    _vec3Scale.set(hoverScale, hoverScale, hoverScale);
    meshRef.current.scale.lerp(_vec3Scale, 0.1);

    // Rotation parallax (tilt)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, baseRotation[0] + targetY * 0.2, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, baseRotation[1] + targetX * 0.3, 0.08);

    // Position parallax (depth/inertia)
    const depthFactor = 1 + index * 0.15;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0] + targetX / depthFactor, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1] + targetY / depthFactor, 0.05);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[2.2, 2.2, 0.7, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={2}
        thickness={2.5}
        chromaticAberration={1.2}
        anisotropy={0.2}
        distortion={0.05}
        distortionScale={0.1}
        temporalDistortion={0}
        iridescence={1}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 400]}
        clearcoat={1}
        attenuationDistance={1}
        attenuationColor="#ffffff"
        color="#ffffff"
      />
    </mesh>
  );
}

function SceneContents() {
  const discs = useMemo<[number, number, number][]>(() => [
    [-11, 2, -4],
    [-7.5, 0, -2],
    [-4, -1.5, 0],
    [0, -2, 1],
    [4, -1, 0],
    [7.5, 1, -2],
    [11, 3, -4]
  ], []);

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
      <pointLight position={[0, 0, 5]} intensity={1} color="#00ffff" />
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
      <group rotation={[0.2, 0, 0]}>
        {discs.map((pos, index) => (
          <GlassDisc key={index} position={pos} index={index} />
        ))}
      </group>
      <ContactShadows position={[0, -6, 0]} opacity={0.15} scale={40} blur={2.5} far={10} />
    </>
  );
}

export default function Scene() {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-[1] pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Transparent background so image shows through
        }}
      >
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </Canvas>
    </div>
  );
}

