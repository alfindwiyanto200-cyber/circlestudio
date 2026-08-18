'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   Logo data
   Arrays are deliberately different across rows so the
   visual content never lines up in a rigid column.
───────────────────────────────────────────────────────── */
const ROW_1 = ['PictelAI', 'Shutterframe', 'Convergence', 'CoreOS', 'Warpspeed', 'Layers'];
const ROW_2 = ['Ikigai Labs', 'Frame', 'Visionwork', 'Orbit', 'Nexio', 'Shutterframe'];
const ROW_3 = ['Convergence', 'Warpspeed', 'PictelAI', 'Ikigai Labs', 'CoreOS', 'Frame'];

/* ─────────────────────────────────────────────────────────
   MarqueeRow
   • Duplicates logo array 2× so the strip is exactly 2×
     viewport-wide → animating to -50% = seamless loop
   • direction: 'left' | 'right'
   • duration: seconds for one full pass
   • Pause-on-hover via animationPlayState
───────────────────────────────────────────────────────── */
interface MarqueeRowProps {
  logos: string[];
  direction: 'left' | 'right';
  duration: number;
  revealDelay?: number;
}

function MarqueeRow({ logos, direction, duration, revealDelay = 0 }: MarqueeRowProps) {
  const [paused, setPaused] = useState(false);
  // Duplicate 2× for seamless loop
  const strip = [...logos, ...logos];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: revealDelay }}
      /* Gradient mask – logos fade in from left, out to right */
      className="relative overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-5 w-max"
        style={{
          animation: `${direction === 'left' ? 'marquee-left' : 'marquee-right'} ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {strip.map((name, idx) => (
          <LogoChip key={`${name}-${idx}`} name={name} />
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   LogoChip
   • Resting: opacity-35, gray text
   • Hover:   opacity-100, #111, scale up, shadow
───────────────────────────────────────────────────────── */
function LogoChip({ name }: { name: string }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.07,
        transition: { type: 'spring', stiffness: 380, damping: 22, mass: 0.7 },
      }}
      className="
        group
        flex-shrink-0
        flex items-center justify-center
        px-9 py-5
        rounded-2xl
        border border-[#E2E2E2]
        bg-white
        shadow-[0_1px_3px_rgba(0,0,0,0.05)]
        cursor-default select-none
        hover:border-[#BDBDBD]
        hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]
        transition-shadow duration-300
      "
      style={{ opacity: 0.38 }}
      /* Framer can't animate CSS opacity via group-hover;
         handle hover opacity with CSS custom property trick */
      onMouseEnter={(e) =>
        (e.currentTarget.style.opacity = '1')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.opacity = '0.38')
      }
    >
      <span
        className="
          font-semibold text-[17px] tracking-tight
          text-[#111]
          whitespace-nowrap
        "
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {name}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Section
───────────────────────────────────────────────────────── */
export default function OurClients() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headlineRef, { once: true, margin: '-80px' });

  return (
    <section
      id="our-clients"
      className="relative w-full bg-[#FAFAFA] border-t border-[#EBEBEB] overflow-hidden"
    >
      {/* Top hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #C8C8C8 30%, #C8C8C8 70%, transparent 100%)',
        }}
      />

      <div className="max-w-[1340px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">

          {/* ── Left column: sticky info text ── */}
          <div
            ref={headlineRef}
            className="lg:w-[36%] flex-shrink-0 lg:sticky lg:top-32 self-start"
          >
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
                Our Clients
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="
                text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem]
                leading-[1.04] font-bold tracking-[-0.035em]
                text-[#111] font-serif
              "
            >
              Trusted by<br />
              world&#8209;leading<br />
              enterprises
            </motion.h2>

            {/* Body copy */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.22 }}
              className="mt-6 text-[15px] leading-relaxed text-[#777] max-w-[280px]"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              From early-stage startups to Fortune 500 leaders — brands rely on
              us to design what&apos;s next.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.34 }}
              className="mt-10 flex gap-10"
            >
              {[
                { value: '9+',   label: 'Global clients' },
                { value: '100%', label: 'Satisfaction rate' },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-[2rem] font-bold text-[#111] leading-none"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[11px] text-[#AAA] mt-1.5 uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column: 3-row marquee cloud ── */}
          <div className="lg:w-[64%] flex flex-col gap-3.5 overflow-hidden">
            {/* Row 1 → scrolls left at medium speed */}
            <MarqueeRow
              logos={ROW_1}
              direction="left"
              duration={28}
              revealDelay={0.0}
            />
            {/* Row 2 → scrolls right (creates counter-motion depth) */}
            <MarqueeRow
              logos={ROW_2}
              direction="right"
              duration={34}
              revealDelay={0.08}
            />
            {/* Row 3 → scrolls left at slightly faster pace */}
            <MarqueeRow
              logos={ROW_3}
              direction="left"
              duration={24}
              revealDelay={0.16}
            />

            {/* NDA note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-3 text-[11.5px] text-[#C0C0C0] tracking-wide pl-1"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              + many more under NDA
            </motion.p>
          </div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #F0F0F0 100%)' }}
      />
    </section>
  );
}
