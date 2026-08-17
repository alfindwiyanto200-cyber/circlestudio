"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function GlassDisc({ position, index }: { position: [number, number, number], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Base rotation for variety
  const baseRotation = useMemo(() => [
    Math.random() * Math.PI,
    (Math.random() - 0.5) * 0.8,
    (Math.random() - 0.5) * 0.8
  ], []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smooth mouse parallax target
    const targetX = (state.pointer.x * 3);
    const targetY = (state.pointer.y * 3);
    
    // Calculate distance for hover physics
    // state.pointer is normalized (-1 to 1), map it to approximate world units (e.g., * 10)
    const pointerWorld = new THREE.Vector2(state.pointer.x * 12, state.pointer.y * 8);
    const discPos = new THREE.Vector2(position[0], position[1]);
    const distance = pointerWorld.distanceTo(discPos);
    
    // Hover scale spring effect
    const hoverScale = distance < 3 ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, hoverScale), 0.1);

    // Rotation parallax (tilt)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, baseRotation[0] + targetY * 0.2, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, baseRotation[1] + targetX * 0.3, 0.08);
    
    // Position parallax (depth/inertia)
    const depthFactor = 1 + (index * 0.15);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0] + targetX / depthFactor, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1] + targetY / depthFactor, 0.05);
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <cylinderGeometry args={[2.2, 2.2, 0.7, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={2.5}
        chromaticAberration={1.5}
        anisotropy={0.3}
        distortion={0.1}
        distortionScale={0.2}
        temporalDistortion={0.05}
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

export default function Scene() {
  // Array of positions to create a wave/arc of discs
  const discs = useMemo(() => [
    [-11, 2, -4],
    [-7.5, 0, -2],
    [-4, -1.5, 0],
    [0, -2, 1],
    [4, -1, 0],
    [7.5, 1, -2],
    [11, 3, -4]
  ], []);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 15], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
        <pointLight position={[0, 0, 5]} intensity={1} color="#00ffff" />
        
        {/* Environment map for realistic glass reflections */}
        <Environment preset="studio" />
        
        <group rotation={[0.2, 0, 0]}>
          {discs.map((pos, index) => (
            <GlassDisc key={index} position={pos as [number, number, number]} index={index} />
          ))}
        </group>

        <ContactShadows position={[0, -6, 0]} opacity={0.3} scale={40} blur={2.5} far={10} />
      </Canvas>
    </div>
  );
}
