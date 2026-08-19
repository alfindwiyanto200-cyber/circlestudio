'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─────────────────────────────────────────────
   3D Glass Icon – Discovery
   Prismatic gradient ring / circle
───────────────────────────────────────────── */
function IconDiscovery() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden>
      <defs>
        <radialGradient id="disc-bg" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#E0D4FF" />
          <stop offset="75%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </radialGradient>
        <radialGradient id="disc-shine" cx="30%" cy="22%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.90" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="disc-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="30%" stopColor="#818CF8" />
          <stop offset="60%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <filter id="disc-shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#7C3AED" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Outer prismatic ring */}
      <circle cx="48" cy="48" r="46" stroke="url(#disc-ring)" strokeWidth="3" opacity="0.7" />

      {/* Main orb */}
      <circle cx="48" cy="48" r="40" fill="url(#disc-bg)" filter="url(#disc-shadow)" />

      {/* Gloss specular */}
      <circle cx="48" cy="48" r="40" fill="url(#disc-shine)" />

      {/* Inner detail — concentric rings */}
      <circle cx="48" cy="48" r="26" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.35" fill="none" />
      <circle cx="48" cy="48" r="16" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.25" fill="none" />

      {/* Center dot */}
      <circle cx="48" cy="48" r="5" fill="#FFFFFF" fillOpacity="0.9" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   3D Glass Icon – Strategy
   Glossy rounded-square / crystal diamond
───────────────────────────────────────────── */
function IconStrategy() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden>
      <defs>
        <linearGradient id="strat-bg" x1="10%" y1="5%" x2="90%" y2="95%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="25%" stopColor="#BAE6FD" />
          <stop offset="55%" stopColor="#38BDF8" />
          <stop offset="80%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <radialGradient id="strat-shine" cx="28%" cy="22%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="strat-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0ABFC" />
          <stop offset="40%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>
        <filter id="strat-shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0EA5E9" floodOpacity="0.38" />
        </filter>
      </defs>

      {/* Outer iridescent border */}
      <rect x="3" y="3" width="90" height="90" rx="26" stroke="url(#strat-border)" strokeWidth="2.5" opacity="0.75" />

      {/* Main glossy square */}
      <rect x="8" y="8" width="80" height="80" rx="22" fill="url(#strat-bg)" filter="url(#strat-shadow)" />

      {/* Gloss overlay */}
      <rect x="8" y="8" width="80" height="80" rx="22" fill="url(#strat-shine)" />

      {/* Inner grid lines for "strategy" feel */}
      <line x1="48" y1="22" x2="48" y2="74" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="22" y1="48" x2="74" y2="48" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.3" />

      {/* Cross-hair center */}
      <circle cx="48" cy="48" r="7" fill="#FFFFFF" fillOpacity="0.85" />
      <circle cx="48" cy="48" r="3" fill="#0EA5E9" fillOpacity="0.9" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   3D Glass Icon – Design
   4-orb iridescent floral / clover badge
───────────────────────────────────────────── */
function IconDesign() {
  const orbs = [
    { cx: 32, cy: 32, g: 'orb-a' },
    { cx: 64, cy: 32, g: 'orb-b' },
    { cx: 32, cy: 64, g: 'orb-c' },
    { cx: 64, cy: 64, g: 'orb-d' },
  ];

  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden>
      <defs>
        {/* Orb A – rose/pink */}
        <radialGradient id="orb-a" cx="35%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#FFF1F2" />
          <stop offset="50%" stopColor="#FDA4AF" />
          <stop offset="100%" stopColor="#E11D48" />
        </radialGradient>
        {/* Orb B – amber/gold */}
        <radialGradient id="orb-b" cx="35%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        {/* Orb C – teal/emerald */}
        <radialGradient id="orb-c" cx="35%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#F0FDF4" />
          <stop offset="50%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>
        {/* Orb D – violet/indigo */}
        <radialGradient id="orb-d" cx="35%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
        {/* Shared gloss */}
        <radialGradient id="orb-shine" cx="30%" cy="24%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id="orb-shadow">
          <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#000000" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* 4 colored orbs in corners */}
      {orbs.map(({ cx, cy, g }) => (
        <g key={g} filter="url(#orb-shadow)">
          <circle cx={cx} cy={cy} r="20" fill={`url(#${g})`} />
          <circle cx={cx} cy={cy} r="20" fill="url(#orb-shine)" />
        </g>
      ))}

      {/* Central white connector dot */}
      <circle cx="48" cy="48" r="9" fill="#FFFFFF" fillOpacity="0.95"
        style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }} />
      <circle cx="48" cy="48" r="4" fill="#E879F9" fillOpacity="0.9" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Step data
───────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    icon: <IconDiscovery />,
    title: 'Discovery',
    desc: 'Membedah inti bisnis, perilaku pasar, dan tantangan audiens untuk menemukan wawasan kunci sebagai fondasi digital yang kuat.',
  },
  {
    num: '02',
    icon: <IconStrategy />,
    title: 'Strategy',
    desc: 'Merancang positioning brand, struktur pengalaman pengguna, dan peta jalan digital agar setiap langkah selaras dengan target pertumbuhan.',
  },
  {
    num: '03',
    icon: <IconDesign />,
    title: 'Design & Build',
    desc: 'Mewujudkan strategi menjadi identitas visual, UI/UX presisi, dan aset digital modern yang berdaya pikat serta mendorong konversi.',
  },
];

/* ─────────────────────────────────────────────
   StepCard — individual process card
───────────────────────────────────────────── */
function StepCard({
  step,
  delay,
}: {
  step: (typeof STEPS)[number];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 48px rgba(0,0,0,0.09)',
        transition: { type: 'spring', stiffness: 300, damping: 24 },
      }}
      className="
        group
        relative flex flex-col
        bg-white
        border border-[#EBEBEB]
        rounded-[28px]
        p-8 md:p-10
        cursor-default
        shadow-[0_2px_12px_rgba(0,0,0,0.05)]
        transition-colors duration-300
      "
    >
      {/* Step number — top right */}
      <span
        className="
          absolute top-8 right-8
          text-[11px] font-semibold tracking-[0.18em] text-[#BDBDBD] uppercase
        "
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {step.num}
      </span>

      {/* 3D Glass Icon with spring hover */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
        className="mb-8 self-start"
      >
        {step.icon}
      </motion.div>

      {/* Step title */}
      <h3
        className="
          font-serif font-bold text-[1.55rem] text-[#111]
          leading-tight tracking-[-0.02em] mb-4
        "
      >
        {step.title}
      </h3>

      {/* Divider */}
      <div className="w-8 h-[2px] bg-[#E5E5E5] mb-5 rounded-full" />

      {/* Description */}
      <p
        className="text-[14.5px] leading-[1.72] text-[#666] flex-1"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {step.desc}
      </p>

      {/* Hover bottom accent line */}
      <div
        className="
          absolute bottom-0 inset-x-0 h-[3px] rounded-b-[28px]
          opacity-0 group-hover:opacity-100
          transition-opacity duration-400
        "
        style={{
          background:
            'linear-gradient(90deg, #818CF8 0%, #34D399 50%, #FBBF24 100%)',
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Section Export
───────────────────────────────────────────── */
export default function HowWeWork() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section
      id="how-we-work"
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

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">

        {/* ── Section header ── */}
        <div ref={headerRef} className="mb-16 md:mb-20">
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
              How We Work
            </span>
          </motion.div>

          {/* Headline + optional subtext in 2-col */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="
                font-serif font-bold text-[#111]
                text-[2.4rem] md:text-[3rem] lg:text-[3.5rem]
                leading-[1.06] tracking-[-0.035em]
                max-w-[540px]
              "
            >
              Mengubah Kompleksitas<br />Menjadi Dampak Nyata.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="
                text-[14.5px] leading-relaxed text-[#888]
                max-w-[300px] md:text-right
              "
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Proses terstruktur dan terukur untuk mengubah ambisi brand Anda menjadi performa digital yang nyata.
            </motion.p>
          </div>
        </div>

        {/* ── 3-Column Step Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {STEPS.map((step, idx) => (
            <StepCard key={step.num} step={step} delay={idx * 0.12} />
          ))}
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
