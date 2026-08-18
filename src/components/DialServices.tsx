'use client';

import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';

/* ─────────────────────────────────────────────
   Service data
───────────────────────────────────────────── */
const SERVICES = [
  {
    num: '01',
    title: 'Brand Identity & Strategy',
    desc: 'We build meaningful brand identities — from strategic positioning to visual systems that bring your brand to life.',
    tags: ['Positioning', 'Visual Identity', 'Design System'],
    gradient: ['#667EEA', '#764BA2', '#F093FB'],
  },
  {
    num: '02',
    title: 'Digital Marketing & Growth',
    desc: 'We craft modern brand identities built to thrive across digital platforms and experiences.',
    tags: ['Conversion Rate Optimization', 'Analytics', 'A/B Testing'],
    gradient: ['#F093FB', '#F5576C', '#FEE140'],
  },
  {
    num: '03',
    title: 'Social Media & Content Marketing',
    desc: 'We create strategic content and campaigns that grow audiences and strengthen brand presence.',
    tags: ['Content Strategy', 'Creative Production', 'Campaign Management'],
    gradient: ['#4FACFE', '#00F2FE', '#43E97B'],
  },
  {
    num: '04',
    title: 'UI/UX & Product Design',
    desc: 'We design intuitive interfaces and user journeys that enhance usability, engagement, and product experience.',
    tags: ['User Research', 'Interface Design', 'Product Scaling'],
    gradient: ['#43E97B', '#38F9D7', '#4FACFE'],
  },
  {
    num: '05',
    title: 'Website Design & Development',
    desc: 'We build fast, scalable websites designed for performance, clarity, and seamless digital experiences.',
    tags: ['UI Development', 'Performance', 'SEO Setup'],
    gradient: ['#FA709A', '#FEE140', '#667EEA'],
  },
] as const;

/* ─────────────────────────────────────────────
   RotaryDial
   • Items animate independently to Y = delta * spacing
   • X follows an arc offset (closer to edge when active)
   • Arc SVG is a decorative background
───────────────────────────────────────────── */
const ITEM_SPACING = 88; // px between slots

function RotaryDial({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center">
      {/* Decorative arc SVG — the circular rail */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 160 800"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {/* Main arc curve */}
        <path
          d="M 148,0 C 55,80 15,200 6,400 C 15,600 55,720 148,800"
          stroke="#E8E8E8"
          strokeWidth="1"
        />
        {/* Tick marks at each item's arc position */}
        {SERVICES.map((_, i) => {
          const t = i / (SERVICES.length - 1); // 0 → 1
          // Parametric approximation of the arc above
          const sy = 400 + (t - 0.5) * 660;
          const dx = Math.abs(t - 0.5) * 2; // 0 at center, 1 at ends
          const sx = 148 - 130 * (1 - dx * dx); // roughly follows the path x
          const isActive = i === activeIndex;
          return (
            <line
              key={i}
              x1={sx - 2}
              y1={sy}
              x2={sx + 10}
              y2={sy}
              stroke={isActive ? '#111' : '#DEDEDE'}
              strokeWidth={isActive ? '2' : '1'}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Number items — each positioned independently */}
      <div className="absolute inset-0 flex items-center justify-end pr-5">
        {SERVICES.map((service, i) => {
          const delta = i - activeIndex;
          const absDelta = Math.abs(delta);
          const isActive = delta === 0;

          return (
            <motion.div
              key={service.num}
              className="absolute right-5 flex items-center gap-2.5"
              animate={{
                y: delta * ITEM_SPACING,
                x: -(absDelta * 12),
                opacity: Math.max(0.08, 1 - absDelta * 0.26),
              }}
              transition={{
                type: 'spring',
                stiffness: 110,
                damping: 22,
                mass: 1,
              }}
            >
              {/* Red active dot */}
              <motion.span
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.3 }}
                transition={{ duration: 0.28 }}
                className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"
              />

              {/* Number */}
              <motion.span
                animate={{
                  color: isActive ? '#111111' : '#CCCCCC',
                  fontStyle: isActive ? 'normal' : 'italic',
                }}
                className="whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: isActive ? '22px' : '14px',
                  fontWeight: isActive ? 800 : 400,
                  transition: 'font-size 0.3s, font-weight 0.3s',
                }}
              >
                {service.num}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AbstractVisual
   Colour-reactive gradient shape — right column
───────────────────────────────────────────── */
function AbstractVisual({ activeIndex }: { activeIndex: number }) {
  const { gradient } = SERVICES[activeIndex];

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -18 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 rounded-[32px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 50%, ${gradient[2]} 100%)`,
          }}
        >
          {/* Rotating conic shimmer */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(255,255,255,0.08), rgba(255,255,255,0.28), rgba(255,255,255,0.0), rgba(255,255,255,0.18), rgba(255,255,255,0.08))',
            }}
          />

          {/* Specular gloss top-left */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 28% 28%, rgba(255,255,255,0.40) 0%, transparent 55%)',
            }}
          />

          {/* Floating inner orb */}
          <motion.div
            animate={{ y: [-8, 8, -8], x: [-4, 4, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-8 rounded-3xl"
            style={{
              background:
                'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.30) 0%, transparent 60%)',
            }}
          />

          {/* Progress pill row (bottom) */}
          <div className="absolute bottom-6 left-6 flex gap-2 items-center">
            {SERVICES.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === activeIndex ? 28 : 6,
                  opacity: i === activeIndex ? 1 : 0.38,
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="h-[3px] rounded-full bg-white"
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main export — DialServices
───────────────────────────────────────────── */
export default function DialServices() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Track scroll progress within the tall wrapper */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(SERVICES.length - 1, Math.floor(v * SERVICES.length));
    setActiveIndex(idx);
  });

  const active = SERVICES[activeIndex];

  return (
    /* ── Scroll capture wrapper (N × 100vh) ── */
    <div
      ref={wrapperRef}
      style={{ height: `${SERVICES.length * 100}vh` }}
      className="relative"
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen bg-[#FAFAFA] border-t border-[#EBEBEB] overflow-hidden">

        {/* Top hairline */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #C8C8C8 30%, #C8C8C8 70%, transparent 100%)',
          }}
        />

        {/* Inner layout */}
        <div className="h-full max-w-[1380px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col">

          {/* Badge row */}
          <div className="flex items-center gap-2.5 pt-9">
            <span className="w-[7px] h-[7px] rounded-full bg-red-500 flex-shrink-0" />
            <span
              className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#666]"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Our Services
            </span>
          </div>

          {/* 3-column grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[180px_1fr_280px] gap-6 xl:gap-10 items-center pb-10">

            {/* ─── LEFT: Rotary Dial ─── */}
            <div className="hidden md:block h-full relative">
              <RotaryDial activeIndex={activeIndex} />
            </div>

            {/* ─── CENTER: Dynamic Content ─── */}
            <div className="relative px-0 md:px-8 xl:px-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{
                    duration: 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Step counter */}
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#AAAAAA] mb-5"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {active.num}&nbsp;/&nbsp;{String(SERVICES.length).padStart(2, '0')}
                  </p>

                  {/* Service title */}
                  <h2
                    className="
                      font-serif font-bold text-[#111]
                      text-[2.2rem] sm:text-[2.8rem] lg:text-[3.5rem] xl:text-[4rem]
                      leading-[1.05] tracking-[-0.03em]
                      mb-6 max-w-[580px]
                    "
                  >
                    {active.title}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-[15.5px] leading-[1.72] text-[#555] max-w-[520px] mb-8"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {active.desc}
                  </p>

                  {/* Tag pills */}
                  <div className="flex flex-wrap gap-2.5">
                    {active.tags.map((tag) => (
                      <span
                        key={tag}
                        className="
                          bg-white border border-neutral-200
                          text-neutral-700 text-[13px]
                          px-4 py-[7px] rounded-full
                          shadow-sm
                        "
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ─── RIGHT: Abstract Visual ─── */}
            <div className="hidden md:block h-[420px] lg:h-[460px]">
              <AbstractVisual activeIndex={activeIndex} />
            </div>

          </div>
        </div>

        {/* Scroll progress bar (bottom edge) */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-[#111] origin-left"
          animate={{
            scaleX: (activeIndex + 1) / SERVICES.length,
          }}
          style={{ width: '100%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        {/* Scroll hint (only on first step) */}
        <AnimatePresence>
          {activeIndex === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-7 right-8 hidden md:flex items-center gap-2 text-[11px] text-[#BBBBBB] uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↓
              </motion.span>
              Scroll to explore
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
