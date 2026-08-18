'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-60px' });

  // Letter split for interactive hover effect
  const word = 'circle';
  const letters = Array.from(word);

  return (
    <footer
      ref={containerRef}
      className="relative w-full bg-[#FAFAFA] border-t border-[#EBEBEB] overflow-hidden pt-16 pb-8"
    >
      {/* Top hairline border decoration */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #C8C8C8 30%, #C8C8C8 70%, transparent 100%)',
        }}
      />

      <div className="max-w-[1340px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col items-center justify-between">
        
        {/* ─── Watermark Branding Typography ─── */}
        <div className="w-full flex justify-center py-10 md:py-16 select-none relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <h2
              className="
                font-serif font-bold text-center leading-none tracking-tighter flex
                bg-gradient-to-b from-[#CCCCCC] via-[#E2E2E2] to-[#FAFAFA]
                bg-clip-text text-transparent
              "
              style={{
                fontSize: 'clamp(8rem, 23vw, 24rem)',
                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.015))',
              }}
            >
              {letters.map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block cursor-default"
                  whileHover={{
                    scale: 1.1,
                    y: -10,
                    color: '#999999', // darkens the character slightly on hover
                    transition: { type: 'spring', stiffness: 350, damping: 15 },
                  }}
                  style={{
                    // Gradient clipping needs manual styling to stay clean during scale
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </h2>
          </motion.div>
        </div>

        {/* ─── Bottom Info Bar ─── */}
        <div
          className="
            w-full border-t border-[#EBEBEB] pt-8 mt-6
            flex flex-col md:flex-row items-center justify-between gap-4
            text-center md:text-left
          "
        >
          {/* Left Text */}
          <div
            className="text-[12px] text-neutral-400 font-medium tracking-wide"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            © 2026 Copyright - Circle | Designed by LoganCee Studio | Build by KOTA
          </div>

          {/* Right Text */}
          <div
            className="text-[12px] text-neutral-400 font-medium tracking-wide flex items-center gap-2"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            <span>Powered by Next.js & Framer</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
