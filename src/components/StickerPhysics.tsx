"use client";

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

// SVG assets for stickers
const STICKERS = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FFD700"/><circle cx="35" cy="40" r="10" fill="black"/><circle cx="65" cy="40" r="10" fill="black"/><path d="M 30 65 Q 50 85 70 65" stroke="black" stroke-width="8" stroke-linecap="round" fill="transparent"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 61,35 93,35 68,54 77,85 50,65 23,85 32,54 7,35 39,35" fill="%23FFD700" stroke="black" stroke-width="4" stroke-linejoin="round"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="25" width="80" height="50" rx="10" fill="%2300FF00" stroke="black" stroke-width="4"/><text x="50" y="55" font-family="monospace" font-weight="bold" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="black">2026</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M 50 20 A 30 30 0 0 0 20 50 A 30 30 0 0 0 50 80 A 30 30 0 0 0 80 50 A 30 30 0 0 0 50 20 Z" fill="white" stroke="black" stroke-width="4"/><circle cx="50" cy="50" r="15" fill="blue"/><circle cx="50" cy="50" r="5" fill="black"/></svg>',
];

export default function StickerPhysics() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create({ gravity: { x: 0, y: 0.5, scale: 0.001 } }));
  const [bodies, setBodies] = useState<{ id: number; x: number; y: number; angle: number; texture: string }[]>([]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = engineRef.current;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    // Note: We don\'t run Render, we just calculate physics and draw HTML ourselves.
    // Actually, Render.create adds a canvas. Let's hide it.
    render.canvas.style.display = 'none';

    // Boundaries
    const thickness = 60;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ground = Matter.Bodies.rectangle(w / 2, h + thickness / 2, w + 100, thickness, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0 - thickness / 2, h / 2, thickness, h * 2, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(w + thickness / 2, h / 2, thickness, h * 2, { isStatic: true });

    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    // Update state to render HTML elements
    let animationFrameId: number;
    const syncBodies = () => {
      setBodies(
        engine.world.bodies
          .filter((b) => !b.isStatic) // Only dynamic bodies (stickers)
          .map((b) => ({
            id: b.id,
            x: b.position.x,
            y: b.position.y,
            angle: b.angle,
            texture: b.plugin.texture, // custom property we will set
          }))
      );
      animationFrameId = requestAnimationFrame(syncBodies);
    };
    syncBodies();

    const handleResize = () => {
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + thickness / 2 });
      Matter.Body.setPosition(rightWall, { x: window.innerWidth + thickness / 2, y: window.innerHeight / 2 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle click to spawn
  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      const size = 100; // sticker size
      const randomTexture = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      
      const newBody = Matter.Bodies.rectangle(e.clientX, e.clientY, size, size, {
        restitution: 0.8, // Bouncy
        friction: 0.1,
        frictionAir: 0.01,
        plugin: { texture: randomTexture }
      });

      // Random initial spin
      Matter.Body.setAngularVelocity(newBody, (Math.random() - 0.5) * 0.2);

      Matter.World.add(engineRef.current.world, newBody);
    };

    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, []);

  return (
    <>
      <div ref={sceneRef} className="absolute inset-0 pointer-events-none z-0" />
      {/* Render HTML elements over physics bodies */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {bodies.map((body) => (
          <img
            key={body.id}
            src={body.texture}
            style={{
              position: 'absolute',
              width: 100,
              height: 100,
              left: body.x - 50,
              top: body.y - 50,
              transform: `rotate(${body.angle}rad)`,
            }}
            alt="Sticker"
          />
        ))}
      </div>
    </>
  );
}
