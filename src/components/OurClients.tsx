'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─────────────────────────────────────────────
   Brand data – pure text logos (monochrome SVG
   word-marks rendered as styled text)
───────────────────────────────────────────── */
const BRANDS = [
  // Row 0 – far-left stagger
  { name: 'PictelAI',     row: 0, col: 0 },
  { name: 'Shutterframe', row: 0, col: 1 },
  { name: 'Convergence',  row: 0, col: 2 },
  // Row 1 – mid stagger (offset right)
  { name: 'CoreOS',       row: 1, col: 0 },
  { name: 'Warpspeed',    row: 1, col: 1 },
  { name: 'Ikigai Labs',  row: 1, col: 2 },
  // Row 2 – bottom stagger (slight left shift)
  { name: 'Orbit',        row: 2, col: 0 },
  { name: 'Layers',       row: 2, col: 1 },
  { name: 'Visionwork',   row: 2, col: 2 },
];

/* ─────────────────────────────────────────────
   Row offset values (px) to create staggered /
   non-rigid grid feel
───────────────────────────────────────────── */
const ROW_OFFSETS = ['0px', '32px', '16px'];

/* ─────────────────────────────────────────────
   Individual logo pill
───────────────────────────────────────────── */
function LogoCard({
  name,
  delay,
}: {
  name: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ scale: 1.06 }}
      className="
        group
        flex items-center justify-center
        px-6 py-4
        border border-[#E5E5E5]
        rounded-2xl
        bg-white/60
        backdrop-blur-sm
        shadow-[0_1px_4px_rgba(0,0,0,0.06)]
        cursor-default
        select-none
        transition-shadow duration-300
        hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]
      "
    >
      <span
        className="
          font-semibold
          text-[15px]
          tracking-tight
          text-[#888]
          group-hover:text-[#111]
          transition-colors duration-300
        "
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {name}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main section component
───────────────────────────────────────────── */
export default function OurClients() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headlineRef, { once: true, margin: '-80px' });

  // Group brands by row
  const rows = [0, 1, 2].map((r) => BRANDS.filter((b) => b.row === r));

  return (
    <section
      id="our-clients"
      className="
        relative w-full
        bg-[#FAFAFA]
        border-t border-[#EBEBEB]
        overflow-hidden
      "
    >
      {/* Subtle top gradient accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #D1D1D1 30%, #D1D1D1 70%, transparent 100%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* ── Left column: sticky text info ── */}
          <div
            ref={headlineRef}
            className="lg:w-[38%] lg:sticky lg:top-32 self-start"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center gap-2 mb-6"
            >
              <span
                className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"
                aria-hidden="true"
              />
              <span
                className="
                  text-[11px] font-semibold uppercase tracking-[0.18em]
                  text-[#555]
                "
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Our Clients
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="
                text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem]
                leading-[1.05]
                font-bold
                tracking-[-0.03em]
                text-[#111]
                font-serif
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
              className="mt-6 text-[15px] leading-relaxed text-[#777] max-w-[300px]"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              From early-stage startups to Fortune 500 leaders — brands rely on
              us to design what&apos;s next.
            </motion.p>

            {/* Stat row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="mt-10 flex gap-8"
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
                  <div className="text-[12px] text-[#999] mt-1 uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column: staggered logo grid ── */}
          <div className="lg:w-[62%] flex flex-col gap-4">
            {rows.map((row, rIdx) => (
              <div
                key={rIdx}
                className="flex flex-wrap gap-3 sm:gap-4"
                style={{ paddingLeft: ROW_OFFSETS[rIdx] }}
              >
                {row.map((brand, bIdx) => (
                  <LogoCard
                    key={brand.name}
                    name={brand.name}
                    delay={rIdx * 0.08 + bIdx * 0.06}
                  />
                ))}
              </div>
            ))}

            {/* Subtle floating note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-[12px] text-[#BBBBBB] tracking-wide"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              + many more under NDA
            </motion.p>
          </div>

        </div>
      </div>

      {/* Bottom gradient fade-out */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, #F4F4F4 100%)',
        }}
      />
    </section>
  );
}
