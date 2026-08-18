'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─────────────────────────────────────────────
   Data Konten Testimonials
───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: '"Orionix transformed our brand and website into a powerful growth engine."',
    author: 'Daniel Carter',
    role: 'Founder & CEO, NovaTech',
    initials: 'DC',
  },
  {
    quote: '"Their strategy and UI design elevated our entire product experience."',
    author: 'Ethan Walker',
    role: 'Product Director, Lumina Labs',
    initials: 'EW',
  },
  {
    quote: '"Orionix helped us clarify our brand and launch confidently."',
    author: 'Marcus Rivera',
    role: 'Head of Marketing, Horizon Collective',
    initials: 'MR',
  },
] as const;


/* ─────────────────────────────────────────────
   Insights / Articles data
───────────────────────────────────────────── */
const ARTICLES = [
  {
    title: 'Great UI/UX Starts with...',
    tag: 'Design',
    date: 'JUNE 2, 2026',
    excerpt: 'Discover the fundamental principles of user interface design that drive engagement and conversions.',
    // Stylized SVG thumbnail type
    visualType: 'organic',
  },
  {
    title: 'Designing Brands for the Digital-First Era',
    tag: 'Branding',
    date: 'JUNE 2, 2026',
    excerpt: 'How modern brands adapt their visual identity to stand out across digital touchpoints.',
    visualType: 'architecture',
  },
  {
    title: 'Building Websites That Convert and Scale',
    tag: 'Development',
    date: 'JUNE 2, 2026',
    excerpt: 'Key strategies for creating high-performance websites that turn visitors into loyal customers.',
    visualType: 'fluid',
  },
] as const;

/* ─────────────────────────────────────────────
   Illustrative SVG vectors for thumbnails
───────────────────────────────────────────── */
function ArticleVisual({ type }: { type: 'organic' | 'architecture' | 'fluid' }) {
  if (type === 'organic') {
    return (
      <svg className="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#161616" />
        <path d="M40 75C40 45 75 40 100 40C125 40 160 45 160 75C160 105 125 110 100 110C75 110 40 105 40 75Z" stroke="#333333" strokeWidth="1.5" />
        <path d="M60 75C60 55 80 50 100 50C120 50 140 55 140 75C140 95 120 100 100 100C80 100 60 95 60 75Z" stroke="#444444" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="75" r="10" fill="#262626" stroke="#555555" strokeWidth="1" />
      </svg>
    );
  }

  if (type === 'architecture') {
    return (
      <svg className="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#121212" />
        {/* Isometric grid projection lines */}
        <line x1="20" y1="20" x2="180" y2="130" stroke="#2A2A2A" strokeWidth="1" />
        <line x1="20" y1="130" x2="180" y2="20" stroke="#2A2A2A" strokeWidth="1" />
        <rect x="70" y="45" width="60" height="60" rx="6" stroke="#444444" strokeWidth="1.5" fill="#1C1C1C" />
        <rect x="85" y="60" width="30" height="30" rx="3" stroke="#666666" strokeWidth="1" fill="#282828" />
      </svg>
    );
  }

  // Fluid waves
  return (
    <svg className="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#181818" />
      <path d="M 0,75 Q 50,45 100,75 T 200,75" stroke="#333333" strokeWidth="1.5" />
      <path d="M 0,95 Q 50,65 100,95 T 200,95" stroke="#444444" strokeWidth="1" opacity="0.7" />
      <path d="M 0,55 Q 50,25 100,55 T 200,55" stroke="#222222" strokeWidth="2" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function ClientVoicesInsights() {
  const containerRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);

  const inViewVoices = useInView(containerRef, { once: true, margin: '-80px' });
  const inViewInsights = useInView(insightsRef, { once: true, margin: '-80px' });

  return (
    <div className="w-full bg-[#FAFAFA] flex flex-col overflow-hidden">

      {/* ─────────────────────────────────────────────
         SUB-SECTION A: CLIENT VOICES (TESTIMONIALS)
      ───────────────────────────────────────────── */}
      <section id="testimonials" className="relative w-full border-t border-[#EBEBEB]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          {/* Header */}
          <div className="mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inViewVoices ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center gap-2.5 mb-7"
            >
              <span className="w-[7px] h-[7px] rounded-full bg-red-500 flex-shrink-0" />
              <span
                className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#666]"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Client Voices
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inViewVoices ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="
                font-serif font-bold text-[#111]
                text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem]
                leading-[1.04] tracking-[-0.035em]
                max-w-[620px]
              "
            >
              Where ambitious brands build their digital future
            </motion.h2>
          </div>

          {/* Testimonial Cards Grid */}
          <div
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-20"
          >
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 36 }}
                animate={inViewVoices ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: idx * 0.12 }}
                className="
                  flex flex-col bg-white border border-[#EBEBEB] rounded-[28px] p-8 md:p-10 shadow-sm
                "
              >
                {/* Avatar Placeholder (Dark warm monochrome circle with initials) */}
                <div className="relative mb-8">
                  <div
                    className="
                      rounded-full w-24 h-24 flex items-center justify-center
                      bg-gradient-to-br from-[#242424] to-[#121212]
                      border-2 border-white shadow-md text-white text-xl font-bold font-serif
                    "
                  >
                    {t.initials}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="flex-1 font-serif text-[1.4rem] leading-relaxed text-[#111111] font-medium mb-8">
                  {t.quote}
                </blockquote>

                {/* Author & Role */}
                <div>
                  <h4 className="font-semibold text-[#111] text-[15px]">{t.author}</h4>
                  <p
                    className="text-neutral-500 text-[13px] mt-1"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {t.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>


        </div>
      </section>

      {/* ─────────────────────────────────────────────
         SUB-SECTION B: INSIGHTS & PERSPECTIVES
      ───────────────────────────────────────────── */}
      <section id="insights" className="relative w-full border-t border-[#EBEBEB] pb-24 md:pb-32">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-24 md:pt-32">
          {/* Header */}
          <div className="mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inViewInsights ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center gap-2.5 mb-7"
            >
              <span className="w-[7px] h-[7px] rounded-full bg-red-500 flex-shrink-0" />
              <span
                className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#666]"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Insights
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inViewInsights ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="
                font-serif font-bold text-[#111]
                text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem]
                leading-[1.04] tracking-[-0.035em]
              "
            >
              Insights & Perspectives
            </motion.h2>
          </div>

          {/* Article Grid */}
          <div
            ref={insightsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {ARTICLES.map((article, idx) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 36 }}
                animate={inViewInsights ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: idx * 0.12 }}
                className="
                  group flex flex-col bg-white border border-[#EBEBEB] rounded-[28px] p-6 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md
                "
              >
                {/* Meta info: Date & Category */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-[11px] font-semibold text-neutral-400 tracking-wider"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {article.date}
                  </span>
                  <span
                    className="
                      border border-neutral-200 bg-neutral-50 rounded-full
                      px-3 py-1 text-[11px] font-medium text-neutral-600
                    "
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {article.tag}
                  </span>
                </div>

                {/* Content: Title & Excerpt */}
                <div className="flex-1 mb-8">
                  <h3 className="font-serif font-bold text-xl text-[#111] leading-snug group-hover:text-black mb-3">
                    {article.title}
                  </h3>
                  <p
                    className="text-neutral-500 text-[14px] leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {article.excerpt}
                  </p>
                </div>

                {/* Animated visual thumbnail at bottom */}
                <div className="relative overflow-hidden rounded-[20px] aspect-[4/3] w-full border border-neutral-800/10">
                  <div className="w-full h-full transition-transform duration-500 ease-[0.25,0.46,0.45,0.94] group-hover:scale-105">
                    <ArticleVisual type={article.visualType} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
