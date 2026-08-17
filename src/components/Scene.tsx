"use client";

import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// ─── Module-level shared state (no React overhead) ───────────────────────────
const mouseNDC = new THREE.Vector2(0, 0);

// Reusable computation objects — never allocated inside useFrame
const _worldPos  = new THREE.Vector3();
const _screenPos = new THREE.Vector2();
const _scaleVec  = new THREE.Vector3();

// ─── Disc layout ─────────────────────────────────────────────────────────────
const DISC_POSITIONS: [number, number, number][] = [
  [-11,  2.0, -4],
  [ -7,  0.5, -2],
  [ -3.5, -1,  0],
  [  0,  -1.5, 1],
  [  3.5, -0.5, 0],
  [  7,   1.0, -2],
  [ 11,   3.0, -4],
];

// ─── Single Glass Disc ────────────────────────────────────────────────────────
function GlassDisc({
  position,
  index,
  baseRot,
}: {
  position: [number, number, number];
  index: number;
  baseRot: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geoRef  = useRef<THREE.CylinderGeometry>(null);

  // Stored once on first useFrame tick (lazy init — avoids useEffect timing issues)
  const origPositions = useRef<Float32Array | null>(null);

  // Spring state — mutable refs so we never cause re-renders
  const springVal = useRef(0);
  const springVel = useRef(0);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const geo  = geoRef.current;
    if (!mesh || !geo) return;

    // ── Lazy-capture original vertex positions (first frame only) ────────────
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    if (!origPositions.current) {
      origPositions.current = new Float32Array(posAttr.array as Float32Array);
    }

    // ── 1. Project disc center → NDC ──────────────────────────────────────────
    _worldPos.setFromMatrixPosition(mesh.matrixWorld);
    _worldPos.project(state.camera);
    _screenPos.set(_worldPos.x, _worldPos.y);

    // ── 2. Cursor proximity (0 = far, 1 = cursor exactly on disc center) ─────
    const dist      = _screenPos.distanceTo(mouseNDC);
    const proximity = Math.max(0, 1 - dist / 0.5); // influence radius = 0.5 NDC

    // ── 3. Spring ODE: mass-spring-damper ────────────────────────────────────
    //    a = (-k * x - c * v) / m
    const k = 220;  // stiffness
    const c = 14;   // damping
    const m = 1.0;  // mass

    if (proximity > 0.02) {
      // Inject velocity impulse proportional to proximity
      springVel.current += proximity * 1.8;
    }
    const acc = (-k * springVal.current - c * springVel.current) / m;
    springVel.current += acc * delta;
    springVal.current += springVel.current * delta;
    springVal.current  = THREE.MathUtils.clamp(springVal.current, -2.2, 2.2);

    // ── 4. CPU Vertex Displacement (Jelly/Wave deformation) ──────────────────
    const arr     = posAttr.array as Float32Array;
    const origArr = origPositions.current;
    const t       = state.clock.elapsedTime;
    const s       = springVal.current;

    for (let i = 0; i < arr.length; i += 3) {
      const ox = origArr[i];
      const oy = origArr[i + 1];
      const oz = origArr[i + 2];

      // Radial distance from disc axis (for cylinder = xz plane)
      const r     = Math.sqrt(ox * ox + oz * oz) + 0.001;
      const angle = Math.atan2(oz, ox);

      // Multi-frequency sine wave modulated by spring value
      const wave =
        Math.sin(angle * 5 + t * 7.0) * 0.6 +
        Math.sin(angle * 3 - t * 4.5) * 0.4 +
        Math.cos(r    * 2 + t * 5.0) * 0.3;

      const disp = wave * s * 0.16; // scale displacement by spring

      // Apply displacement along outward normal in xz plane
      const nx = ox / r;
      const nz = oz / r;

      arr[i]     = ox + nx * disp;
      arr[i + 1] = oy + s * 0.08 * Math.sin(oy * 4 + t * 6); // y ripple
      arr[i + 2] = oz + nz * disp;
    }
    posAttr.needsUpdate = true;
    geo.computeVertexNormals(); // Normals update → refraction follows deformation

    // ── 5. Mouse Parallax: rotation (with depth factor) ──────────────────────
    const depth     = 1 + index * 0.15;
    const targetRotX = baseRot[0] + state.pointer.y * 0.28 / depth;
    const targetRotY = baseRot[1] + state.pointer.x * 0.38 / depth;

    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotX, 0.055);
    mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotY, 0.055);

    // ── 6. Mouse Parallax: position ───────────────────────────────────────────
    mesh.position.x = THREE.MathUtils.lerp(
      mesh.position.x, position[0] + state.pointer.x * 2.2 / depth, 0.04);
    mesh.position.y = THREE.MathUtils.lerp(
      mesh.position.y, position[1] + state.pointer.y * 1.6 / depth, 0.04);

    // ── 7. Scale spring bounce (squash & stretch) ─────────────────────────────
    const sc = THREE.MathUtils.clamp(1 + s * 0.045, 0.88, 1.18);
    _scaleVec.set(sc, 1 + s * 0.02, sc);
    mesh.scale.lerp(_scaleVec, 0.14);
  });

  return (
    <mesh ref={meshRef} position={position} rotation={baseRot}>
      {/* More height segments (12) = more vertices to deform = smoother waves */}
      <cylinderGeometry ref={geoRef} args={[2.2, 2.2, 0.65, 72, 12]} />
      <MeshTransmissionMaterial
        backside
        samples={3}
        thickness={2.5}
        chromaticAberration={1.6}
        anisotropy={0.35}
        distortion={0}
        temporalDistortion={0}
        iridescence={1}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 400]}
        clearcoat={1}
        attenuationDistance={0.75}
        attenuationColor="#ffffff"
        color="#ffffff"
      />
    </mesh>
  );
}

// ─── Scene contents (inside Canvas) ──────────────────────────────────────────
function SceneContents() {
  // Stable base rotations per disc (randomized once on mount)
  const [baseRots] = React.useState<[number, number, number][]>(() =>
    DISC_POSITIONS.map(() => [
      Math.random() * Math.PI,
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.6,
    ])
  );

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[10, 10, 10]}  intensity={2}   color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#cc00ff" />
      <pointLight       position={[0, 0, 6]}      intensity={1.5} color="#00eeff" />

      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>

      <group rotation={[0.15, 0, 0]}>
        {DISC_POSITIONS.map((pos, i) => (
          <GlassDisc key={i} position={pos} index={i} baseRot={baseRots[i]} />
        ))}
      </group>

      <ContactShadows
        position={[0, -6, 0]}
        opacity={0.1}
        scale={40}
        blur={3}
        far={10}
      />
    </>
  );
}

// ─── Root Scene component ─────────────────────────────────────────────────────
export default function Scene() {
  // Track mouse in NDC space at the window level (outside React render cycle)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseNDC.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-[1] pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Transparent → background image shows through
        }}
      >
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </Canvas>
    </div>
  );
}
