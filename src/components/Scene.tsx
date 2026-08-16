"use client";

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function CircleModel() {
  // We assume the user has placed the file back in public/Circle_3D.glb
  const { scene } = useGLTF('/Circle_3D.glb');
  const modelRef = useRef<THREE.Group>(null);

  // Apply the deep blue glossy material
  useEffect(() => {
    if (scene) {
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x0a1b70, // Deep royal blue
        emissive: 0x020826,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.0,
      });

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      
      // Auto-center and scale
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      
      // Center
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;
      
      // Scale down to fit screen reasonably (aim for ~10 units wide)
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 14 / maxDim;
      if (isFinite(scale) && scale > 0) {
        scene.scale.setScalar(scale);
      }
    }
  }, [scene]);

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
}

export default function Scene() {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#081452" />
        
        {/* Environment map for reflections */}
        <Environment preset="city" />
        
        <Float
          speed={2} // Animation speed
          rotationIntensity={0.5} // XYZ rotation intensity
          floatIntensity={1} // Up/down float intensity
          floatingRange={[-0.5, 0.5]} // Range of y-axis values the object will float within
        >
          {/* We wrap the model in a Suspense-like fallback natively handled by Canvas/useGLTF but to be safe we can let it just load */}
          <React.Suspense fallback={null}>
             <CircleModel />
          </React.Suspense>
        </Float>

        <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={10} />
      </Canvas>
    </div>
  );
}
