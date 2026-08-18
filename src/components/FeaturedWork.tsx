'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';

/* ─────────────────────────────────────────
   Project data
   Swap `image` later with your real photos —
   right now we use solid dark bg as placeholder.
───────────────────────────────────────────── */
interface Project {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  /** Hex for the dark placeholder swatch */
  bg: string;
  /** Will be used as <img src> once you add real photos */
  image?: string;
}

const LEFT_PROJECTS: Project[] = [
  {
    id: 'portx',
    title: 'Portx',
    desc: 'Dynamic digital visuals and identity crafted for modern and expressive brands.',
    tags: ['UX/UI', 'Growth'],
    bg: '#1A1A1A',
  },
  {
    id: 'season',
    title: 'Season',
    desc: 'A refined seasonal collection launch built for elegance and digital storytelling.',
    tags: ['Website', 'UX/UI'],
    bg: '#161616',
  },
];

const RIGHT_PROJECTS: Project[] = [
  {
    id: 'rivermark',
    title: 'Rivermark',
    desc: 'Bold street branding campaign designed to capture attention and energize urban audiences.',
    tags: ['Website', 'Social Media'],
    bg: '#111111',
  },
  {
    id: 'fluxa',
    title: 'Fluxa',
    desc: 'Immersive product experience blending motion design with sharp conversion strategy.',
    tags: ['Website', 'Growth'],
    bg: '#0D0D0D',
  },
  {
    id: 'axn',
    title: 'AXN',
    desc: 'Bold identity and social presence for an entertainment brand targeting Gen Z.',
    tags: ['Branding', 'Social Media'],
    bg: '#141414',
  },
];

/* ─────────────────────────────────────────
   ProjectCard
   Layers:
   1. scroll-triggered fade+slide reveal
   2. image zoom on hover (scale 1.05)
   3. magnetic "Open Project" badge that
      follows the cursor within the card
───────────────────────────────────────────── */
function ProjectCard({
  project,
  delay = 0,
}: {
  project: Project;
  delay?: number;
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  /* Raw mouse position inside the card */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  /* Spring-smoothed values → elastic, not snappy */
  const x = useSpring(rawX, { stiffness: 220, damping: 28, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 220, damping: 28, mass: 0.8 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {/* ── Media container ── */}
      <div
        ref={imgRef}
        className="relative overflow-hidden rounded-[28px] aspect-[4/5] cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Dark placeholder — replace with <Image src={project.image} fill … /> */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: project.bg }}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Inner gradient overlay for depth even on solid bg */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.35) 100%)',
          }}
        />

        {/* ── Magnetic "Open Project" badge ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="cursor-badge"
              className="absolute top-0 left-0 z-20 pointer-events-none"
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.55 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.55 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* Centered via -translate-x/y-1/2 so badge is centred on cursor */}
              <div
                className="
                  -translate-x-1/2 -translate-y-1/2
                  w-[110px] h-[110px]
                  rounded-full
                  bg-black/65 backdrop-blur-md
                  flex flex-col items-center justify-center
                  text-white text-[13px] font-semibold text-center leading-snug
                  shadow-[0_8px_36px_rgba(0,0,0,0.45)]
                "
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Open<br />Project
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Project info ── */}
      <div className="mt-6 px-1">
        <h3
          className="font-serif text-[1.75rem] font-bold text-[#111] leading-tight tracking-[-0.025em]"
        >
          {project.title}
        </h3>

        <p
          className="mt-2.5 text-[14.5px] leading-[1.65] text-[#666] max-w-[360px]"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {project.desc}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="
                border border-[#D8D8D8] bg-white rounded-full
                px-4 py-[7px]
                text-[12.5px] font-medium text-[#444]
              "
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────
   Main section
───────────────────────────────────────────── */
export default function FeaturedWork() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section
      id="featured-work"
      className="relative w-full bg-[#FAFAFA] border-t border-[#EBEBEB] overflow-x-hidden"
    >
      {/* Top hairline accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #C8C8C8 30%, #C8C8C8 70%, transparent 100%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-24 pb-32 md:pt-32 md:pb-40">

        {/*
         * ── 2-Column staggered layout ──────────────────────────────
         * The section header lives in the LEFT column as the first slot.
         * Because it is taller than a card, it naturally pushes the left
         * project cards down — creating the asymmetric stagger visible in
         * the reference WITHOUT any artificial margin hacks.
         * The RIGHT column starts from the very top → Rivermark appears
         * beside the intro text, just like in the reference.
         * ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-16 md:gap-y-20 items-start">

          {/* ── LEFT column ────────────────────────── */}
          <div className="flex flex-col gap-16 md:gap-20">

            {/* Section intro header */}
            <div ref={headerRef}>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex items-center gap-2.5 mb-7"
              >
                <span className="w-[7px] h-[7px] rounded-full bg-red-500 flex-shrink-0" />
                <span
                  className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#666]"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  Featured Work
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="
                  font-serif font-bold text-[#111]
                  text-[2.6rem] md:text-[3.1rem] lg:text-[3.6rem]
                  leading-[1.04] tracking-[-0.035em]
                  max-w-[480px]
                "
              >
                Selected projects built with ambitious brands and bold teams
              </motion.h2>

              {/* CTA pill button */}
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.22 }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 10px 36px rgba(0,0,0,0.22)',
                  transition: { type: 'spring', stiffness: 360, damping: 22 },
                }}
                whileTap={{ scale: 0.97 }}
                className="
                  mt-9
                  inline-flex items-center
                  bg-[#111] text-white
                  px-7 py-3.5 rounded-full
                  text-[14px] font-semibold
                  shadow-[0_4px_18px_rgba(0,0,0,0.20)]
                  cursor-pointer select-none
                "
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Book a intro call
              </motion.button>
            </div>

            {/* Left column project cards */}
            {LEFT_PROJECTS.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                delay={idx * 0.1 + 0.05}
              />
            ))}
          </div>

          {/* ── RIGHT column ───────────────────────── */}
          {/* No extra top margin — naturally aligns with the intro text area */}
          <div className="flex flex-col gap-16 md:gap-20">
            {RIGHT_PROJECTS.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                delay={idx * 0.1}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
