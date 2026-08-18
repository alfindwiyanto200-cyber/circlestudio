'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─────────────────────────────────────────────
   Brand data
   Each card carries its own float profile so
   no two cards move identically.
───────────────────────────────────────────── */
interface Brand {
  name: string;
  row: number;
  /** Floating amplitude Y in px  (8–12) */
  ampY: number;
  /** Floating amplitude X in px  (2–5) */
  ampX: number;
  /** Full cycle duration in seconds (3–6) */
  dur: number;
  /** Initial delay before float starts (0–2) */
  floatDelay: number;
  /** Resting opacity before hover (0.45 – 0.65) */
  baseOpacity: number;
}

const BRANDS: Brand[] = [
  // ── Row 0 ──
  { name: 'PictelAI',     row: 0, ampY: 10, ampX: 3, dur: 4.2, floatDelay: 0.0, baseOpacity: 0.55 },
  { name: 'Shutterframe', row: 0, ampY:  8, ampX: 2, dur: 5.1, floatDelay: 0.6, baseOpacity: 0.50 },
  { name: 'Convergence',  row: 0, ampY: 12, ampX: 4, dur: 3.8, floatDelay: 1.1, baseOpacity: 0.60 },
  // ── Row 1 ──
  { name: 'CoreOS',       row: 1, ampY:  9, ampX: 3, dur: 5.5, floatDelay: 0.3, baseOpacity: 0.45 },
  { name: 'Warpspeed',    row: 1, ampY: 11, ampX: 5, dur: 4.0, floatDelay: 0.9, baseOpacity: 0.55 },
  { name: 'Ikigai Labs',  row: 1, ampY:  8, ampX: 2, dur: 6.0, floatDelay: 1.5, baseOpacity: 0.50 },
  // ── Row 2 ──
  { name: 'Frame',        row: 2, ampY: 12, ampX: 4, dur: 3.5, floatDelay: 0.5, baseOpacity: 0.60 },
  { name: 'Layers',       row: 2, ampY:  9, ampX: 3, dur: 4.8, floatDelay: 1.2, baseOpacity: 0.48 },
  { name: 'Visionwork',   row: 2, ampY: 10, ampX: 2, dur: 5.3, floatDelay: 0.0, baseOpacity: 0.55 },
];

/* Horizontal stagger offset per row */
const ROW_OFFSETS = ['0px', '36px', '18px'];

/* ─────────────────────────────────────────────
   LogoCard
   Layered motion:
   1. whileInView  → scroll reveal (fade + slide-up)
   2. animate      → perpetual organic float (Y + subtle X)
   3. whileHover   → spring snap to full opacity + scale
───────────────────────────────────────────── */
function LogoCard({
  brand,
  revealDelay,
}: {
  brand: Brand;
  revealDelay: number;
}) {
  const { name, ampY, ampX, dur, floatDelay, baseOpacity } = brand;

  /*
   * Framer Motion can't do CSS keyframe loops natively on the
   * same axis as whileInView, so we split the concerns:
   *   – outer wrapper handles reveal + hover
   *   – inner div handles the perpetual float
   */
  return (
    /* ── Reveal + Hover wrapper ── */
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: baseOpacity, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: revealDelay }}
      whileHover={{
        opacity: 1,
        scale: 1.08,
        transition: {
          type: 'spring',
          stiffness: 340,
          damping: 22,
          mass: 0.8,
        },
      }}
      className="
        flex items-center justify-center
        px-6 py-[18px]
        border border-[#E2E2E2]
        rounded-2xl
        bg-white
        shadow-[0_1px_3px_rgba(0,0,0,0.07)]
        cursor-default select-none
        hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]
        hover:border-[#C8C8C8]
      "
      style={{ willChange: 'transform, opacity' }}
    >
      {/* ── Perpetual float layer ── */}
      <motion.div
        animate={{
          y: [0, -ampY, 0, ampY * 0.6, 0],
          x: [0, ampX, 0, -ampX * 0.7, 0],
        }}
        transition={{
          duration: dur,
          delay: floatDelay,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      >
        <span
          className="font-semibold text-[15px] tracking-tight text-[#333]"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {name}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main section
───────────────────────────────────────────── */
export default function OurClients() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headlineRef, { once: true, margin: '-80px' });

  const rows = [0, 1, 2].map((r) => BRANDS.filter((b) => b.row === r));

  return (
    <section
      id="our-clients"
      className="relative w-full bg-[#FAFAFA] border-t border-[#EBEBEB] overflow-hidden"
    >
      {/* Top hairline gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #C8C8C8 30%, #C8C8C8 70%, transparent 100%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* ────────────────────────────────
              Left column — sticky text
          ──────────────────────────────── */}
          <div
            ref={headlineRef}
            className="lg:w-[38%] lg:sticky lg:top-32 self-start"
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
                text-[2.6rem] md:text-[3.2rem] lg:text-[3.7rem]
                leading-[1.04] font-bold tracking-[-0.035em]
                text-[#111] font-serif
              "
            >
              Trusted by<br />
              world&#8209;leading<br />
              enterprises
            </motion.h2>

            {/* Supporting copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.22 }}
              className="mt-6 text-[15px] leading-relaxed text-[#777] max-w-[290px]"
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

          {/* ────────────────────────────────
              Right column — floating logo cloud
          ──────────────────────────────── */}
          <div className="lg:w-[62%] flex flex-col gap-5">
            {rows.map((row, rIdx) => (
              <div
                key={rIdx}
                className="flex flex-wrap gap-3 sm:gap-4"
                style={{ paddingLeft: ROW_OFFSETS[rIdx] }}
              >
                {row.map((brand, bIdx) => (
                  <LogoCard
                    key={brand.name}
                    brand={brand}
                    /* stagger: each row starts 80ms after the previous,
                       each card within a row 65ms apart              */
                    revealDelay={rIdx * 0.08 + bIdx * 0.065}
                  />
                ))}
              </div>
            ))}

            {/* NDA note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="mt-4 text-[11.5px] text-[#C0C0C0] tracking-wide"
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
