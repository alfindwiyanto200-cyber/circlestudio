"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform, MotionValue } from 'framer-motion';

// Configuration for each glass disc layer overlay
const DISC_CONFIGS = [
  { id: 0, x: '-36%', y: '20%', size: 320, depth: 1.8, rotate: -55 },
  { id: 1, x: '-20%', y: '45%', size: 260, depth: 1.4, rotate: -72 },
  { id: 2, x: '10%',  y: '62%', size: 180, depth: 1.0, rotate: -82 },
  { id: 3, x: '35%',  y: '70%', size: 150, depth: 0.8, rotate: -88 },
  { id: 4, x: '58%',  y: '63%', size: 200, depth: 1.0, rotate: -78 },
  { id: 5, x: '75%',  y: '40%', size: 270, depth: 1.4, rotate: -60 },
  { id: 6, x: '90%',  y: '10%', size: 340, depth: 1.8, rotate: -45 },
];

// Hue values for the iridescent gradient per disc
const DISC_HUES = [260, 280, 300, 200, 320, 240, 200];

function GlassDiscOverlay({
  config,
  mouseX,
  mouseY,
}: {
  config: (typeof DISC_CONFIGS)[0];
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Each disc translates at a different rate (depth parallax)
  const x       = useTransform(mouseX, (v) => v * config.depth * 30);
  const y       = useTransform(mouseY, (v) => v * config.depth * 20);
  const rotateX = useTransform(mouseY, (v) => v * config.depth * -12);
  const rotateY = useTransform(mouseX, (v) => v * config.depth * 10);

  // Spring physics — high damping = smooth inertia, feels heavy/natural
  const springX    = useSpring(x,       { stiffness: 55, damping: 22, mass: 0.9 });
  const springY    = useSpring(y,       { stiffness: 55, damping: 22, mass: 0.9 });
  const springRotX = useSpring(rotateX, { stiffness: 45, damping: 18, mass: 1.3 });
  const springRotY = useSpring(rotateY, { stiffness: 45, damping: 18, mass: 1.3 });

  const hue = DISC_HUES[config.id] ?? 260;
  const border = Math.round(config.size * 0.07);
  const innerBorder = Math.round(config.size * 0.04);

  return (
    <motion.div
      ref={ref}
      style={{
        position: 'absolute',
        left: config.x,
        top: config.y,
        width: config.size,
        height: config.size,
        x: springX,
        y: springY,
        rotateX: springRotX,
        rotateY: springRotY,
        rotate: config.rotate,
        transformStyle: 'preserve-3d',
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'auto',
      }}
      whileHover={{ scale: 1.09 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      {/* Outer iridescent ring body */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `conic-gradient(
            from 0deg,
            hsla(${hue},       100%, 70%, 0.35),
            hsla(${hue + 60},  100%, 80%, 0.55),
            hsla(${hue + 120}, 100%, 75%, 0.40),
            hsla(${hue + 180}, 100%, 70%, 0.35),
            hsla(${hue + 240}, 100%, 80%, 0.55),
            hsla(${hue},       100%, 70%, 0.35)
          )`,
          border: `${border}px solid rgba(255,255,255,0.22)`,
          boxShadow: `
            0 0 ${config.size * 0.14}px hsla(${hue}, 100%, 70%, 0.28),
            inset 0 0 ${config.size * 0.08}px hsla(${hue + 60}, 100%, 80%, 0.18),
            0 8px 32px rgba(0,0,0,0.25)
          `,
          backdropFilter: 'blur(2px)',
        }}
      />
      {/* Inner lens highlight */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.16), transparent 65%)`,
          border: `${innerBorder}px solid rgba(255,255,255,0.10)`,
        }}
      />
    </motion.div>
  );
}

export default function Scene() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 … +1
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-[1] overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {DISC_CONFIGS.map((config) => (
        <GlassDiscOverlay
          key={config.id}
          config={config}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </div>
  );
}
