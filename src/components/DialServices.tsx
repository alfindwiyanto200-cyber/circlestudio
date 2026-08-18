'use client';

import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';

/* ─────────────────────────────────────────────
   Service data with styled titles for multi-line layout
───────────────────────────────────────────── */
const SERVICES = [
  {
    num: '01',
    title: (
      <>
        Brand Identity
        <br />& Strategy
      </>
    ),
    desc: 'We build meaningful brand identities — from strategic positioning to visual systems that bring your brand to life.',
    tags: ['Positioning', 'Visual Identity', 'Design System'],
  },
  {
    num: '02',
    title: (
      <>
        Digital Marketing
        <br />& Growth
      </>
    ),
    desc: 'We craft modern brand identities built to thrive across digital platforms and experiences.',
    tags: ['Conversion Rate Optimization', 'Analytics', 'A/B Testing'],
  },
  {
    num: '03',
    title: (
      <>
        Social Media
        <br />& Content
      </>
    ),
    desc: 'We create strategic content and campaigns that grow audiences and strengthen brand presence.',
    tags: ['Content Strategy', 'Creative Production', 'Campaign Management'],
  },
  {
    num: '04',
    title: (
      <>
        UI/UX &<br />Product Design
      </>
    ),
    desc: 'We design intuitive interfaces and user journeys that enhance usability, engagement, and product experience.',
    tags: ['User Research', 'Interface Design', 'Product Scaling'],
  },
  {
    num: '05',
    title: (
      <>
        Website Design
        <br />& Development
      </>
    ),
    desc: 'We build fast, scalable websites designed for performance, clarity, and seamless digital experiences.',
    tags: ['UI Development', 'Performance', 'SEO Setup'],
  },
] as const;

/* ─────────────────────────────────────────────
   RotaryDial
   • Parent container rotates around its center (positioned off-screen left)
   • Each child is positioned along the circular perimeter
   • When parent rotates to align a child horizontally, it sits at 0° net rotation
───────────────────────────────────────────── */
const RADIUS = 540; // radius of the dial curve in pixels
const ANGLE_STEP = 16; // degrees spacing between slots

function RotaryDial({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="absolute inset-y-0 left-0 w-[300px] pointer-events-none flex items-center">
      {/* ── Rotating Dial Wheel ── */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-[-840px] w-[1080px] h-[1080px] rounded-full flex items-center justify-center"
        style={{
          transformOrigin: 'center center',
        }}
        animate={{
          rotate: -ANGLE_STEP * activeIndex,
        }}
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 20,
          mass: 1,
        }}
      >
        {/* Curved outline of the circle */}
        <div className="absolute inset-0 rounded-full border border-neutral-200/50 pointer-events-none" />

        {/* Distributed service numbers */}
        {SERVICES.map((service, i) => {
          const isActive = i === activeIndex;

          return (
            <div
              key={service.num}
              className="absolute flex items-center gap-3"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: 'left center',
                transform: `translate(-50%, -50%) rotate(${ANGLE_STEP * i}deg) translate(${RADIUS}px)`,
              }}
            >
              {/* Active solid red dot */}
              <motion.span
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"
              />

              {/* Number */}
              <span
                className={`
                  text-3xl tracking-tight select-none
                  ${isActive ? 'text-[#111111] font-bold font-serif scale-110' : 'text-[#CCCCCC] italic font-serif opacity-40'}
                `}
                style={{
                  transition: 'all 0.35s ease-in-out',
                }}
              >
                {service.num}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AbstractVisual3D
   Clay/ceramic pinwheel model on the right edge
───────────────────────────────────────────── */
function AbstractVisual3D() {
  return (
    <div className="absolute right-[-150px] lg:right-[-260px] top-1/2 -translate-y-1/2 w-[480px] h-[480px] lg:w-[580px] lg:h-[580px] pointer-events-none z-0 select-none">
      <motion.img
        src="/white_clay_pinwheel.jpg"
        alt="Clay pinwheel graphic"
        className="w-full h-full object-contain mix-blend-darken opacity-95"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
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
    /* ── Scroll track container with solid background ── */
    <div
      ref={wrapperRef}
      style={{ height: `${SERVICES.length * 100}vh` }}
      className="relative bg-[#FAFAFA]"
    >
      {/* ── Sticky viewport with clean background ── */}
      <div className="sticky top-0 h-screen bg-[#FAFAFA] border-t border-[#EBEBEB] overflow-hidden z-10">

        {/* Top hairline border decoration */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #C8C8C8 30%, #C8C8C8 70%, transparent 100%)',
          }}
        />

        {/* Inner flex layout */}
        <div className="h-full max-w-[1340px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col relative">

          {/* Badge row */}
          <div className="flex items-center gap-2.5 pt-9 z-10">
            <span className="w-[7px] h-[7px] rounded-full bg-red-500 flex-shrink-0" />
            <span
              className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#666]"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Our Services
            </span>
          </div>

          {/* Main composition grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr] items-center pb-12">

            {/* ─── LEFT: Curved Rotary Dial (Desktop) ─── */}
            <div className="hidden md:block h-full relative">
              <RotaryDial activeIndex={activeIndex} />
            </div>

            {/* ─── CENTER: Dynamic Content Area ─── */}
            <div className="relative px-0 md:pl-16 lg:pl-24 max-w-[700px] z-10">
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
                  {/* Service title */}
                  <h2
                    className="
                      font-serif font-bold text-[#111111]
                      text-[2.6rem] sm:text-[3.2rem] lg:text-[4rem] xl:text-[4.6rem]
                      leading-[1.06] tracking-[-0.035em]
                      mb-6
                    "
                  >
                    {active.title}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-[15.5px] leading-[1.72] text-[#555] max-w-[490px] mb-8"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {active.desc}
                  </p>

                  {/* Tag capsules */}
                  <div className="flex flex-wrap gap-2.5">
                    {active.tags.map((tag) => (
                      <span
                        key={tag}
                        className="
                          bg-white border border-neutral-200/80
                          text-neutral-700 text-[13px] font-medium
                          px-5 py-2.5 rounded-full
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

          </div>

          {/* ─── RIGHT: Rotating Clay Pinwheel ─── */}
          <AbstractVisual3D />

        </div>

        {/* Dynamic scroll progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-[#111111] origin-left z-20"
          animate={{
            scaleX: (activeIndex + 1) / SERVICES.length,
          }}
          style={{ width: '100%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        {/* Scroll helper hint */}
        <AnimatePresence>
          {activeIndex === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-7 right-8 hidden md:flex items-center gap-2 text-[10.5px] text-[#888] uppercase tracking-widest z-20"
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
