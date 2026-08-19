'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PLANS = [
  {
    name: 'Paket Launch',
    desc: 'Fondasi Digital untuk Bisnis & Brand Baru. Dirancang khusus bagi startup dan brand baru yang ingin membangun identitas visual yang berkarakter serta kehadiran digital yang solid dari awal.',
    price: '$6,000',
    period: '/ Project',
    features: [
      'Identitas Visual Brand: Logo utama, variasi logo, palet warna, tipografi, dan buku panduan brand (brand guideline).',
      'Desain & Pengembangan Website: Website responsif hingga 5 halaman yang cepat dan ramah perangkat mobile.',
      'UI/UX Esensial: Alur pengguna (user flow) yang intuitif dan tata letak modern.',
      'Fondasi SEO: Struktur teknis website yang dioptimalkan agar mudah ditemukan di mesin pencari.',
      'Kit Awal Media Sosial: Templat desain siap pakai untuk feed dan story media sosial.',
    ],
    cta: 'Mulai Proyek Bersama Kami',
    popular: false,
  },
  {
    name: 'Paket Growth',
    desc: 'Akselerasi & Skalabilitas Brand Menuju Level Berikutnya. Pilihan ideal untuk bisnis yang sedang berkembang dan membutuhkan strategi visual mendalam, peningkatan performa website, serta optimasi konversi.',
    price: '$12,000',
    period: '/ Project',
    features: [
      'Sistem Branding Menyeluruh: Strategi positioning pasar dan standarisasi visual lintas platform.',
      'Website Kustom & Dinamis: Pengalaman web interaktif, integrasi CMS, serta kecepatan akses tingkat tinggi.',
      'Optimasi UI/UX Lanjutan: Perancangan antarmuka berbasis riset kenyamanan dan retensi pengguna.',
      'Sistem Desain & Konten Media Sosial: Panduan visual konten terstruktur untuk memperkuat eksistensi digital.',
      'Pengaturan Analitik & Konversi: Pemasangan pelacak performa dan optimasi rasio konversi (CRO).',
    ],
    cta: 'Kembangkan Brand Anda',
    popular: false,
  },
  {
    name: 'Paket Retainer / Kemitraan',
    desc: 'Partner Kreatif & Digital Berkelanjutan. Dikhususkan bagi perusahaan visioner yang menginginkan tim kreatif eksternal berdedikasi penuh untuk mengelola desain produk, web, dan kampanye berkelanjutan.',
    price: '$5,000',
    period: '/ month',
    features: [
      'Desain Produk Digital Ujung-ke-Ujung (End-to-End): UI/UX aplikasi web/mobile, sistem desain (design system), dan pengujian alur interaktif.',
      'Pengembangan & Pemeliharaan Web Kustom: Pembaruan berkala, optimasi teknis, dan keamanan sistem.',
      'Manajemen Kampanye & Arah Kreatif (Creative Direction): Perancangan aset promosi digital multi-kanal.',
      'Eksperimen Pertumbuhan: Pengujian A/B (A/B Testing) dan optimalisasi strategi berbasis data secara berkala.',
      'Alur Kerja Khusus (Sprint Dedicated): Tim kreatif prioritas dengan sesi review dan evaluasi strategi rutin.',
    ],
    cta: 'Jadwalkan Diskusi Kemitraan',
    popular: true, // Dark card
  },
] as const;

export default function Pricing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section
      id="pricing"
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
        {/* Header */}
        <div className="mb-16 md:mb-20">
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
              Pricing
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="
              font-serif font-bold text-[#111]
              text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem]
              leading-[1.04] tracking-[-0.035em]
            "
          >
            Choose a plan
            <br />
            that fits your needs
          </motion.h2>
        </div>

        {/* Pricing Cards Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
        >
          {PLANS.map((plan, idx) => {
            const isScale = plan.popular;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: idx * 0.12 }}
                whileHover={{
                  y: -6,
                  boxShadow: isScale
                    ? '0 20px 48px rgba(0,0,0,0.25)'
                    : '0 20px 48px rgba(0,0,0,0.08)',
                  transition: { type: 'spring', stiffness: 300, damping: 24 },
                }}
                className={`
                  relative flex flex-col rounded-[28px] p-8 md:p-10 border transition-all duration-300
                  ${
                    isScale
                      ? 'bg-[#111111] text-white border-neutral-800 shadow-xl'
                      : 'bg-white text-[#111111] border-[#EBEBEB] shadow-sm'
                  }
                `}
              >
                {/* Plan Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Icon placeholder (4 circle grid or red grid) */}
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-neutral-100/10">
                      {isScale ? (
                        // Red Grid Icon
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <rect width="4" height="4" rx="1" fill="#EF4444" />
                          <rect x="8" width="4" height="4" rx="1" fill="#EF4444" />
                          <rect x="16" width="4" height="4" rx="1" fill="#EF4444" />
                          <rect y="8" width="4" height="4" rx="1" fill="#EF4444" />
                          <rect x="8" y="8" width="4" height="4" rx="1" fill="#EF4444" />
                          <rect x="16" y="8" width="4" height="4" rx="1" fill="#EF4444" />
                          <rect y="16" width="4" height="4" rx="1" fill="#EF4444" />
                          <rect x="8" y="16" width="4" height="4" rx="1" fill="#EF4444" />
                          <rect x="16" y="16" width="4" height="4" rx="1" fill="#EF4444" />
                        </svg>
                      ) : (
                        // 4 Circle Grid
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="4" cy="4" r="4" fill="#111111" />
                          <circle cx="14" cy="4" r="4" fill="#111111" />
                          <circle cx="4" cy="14" r="4" fill="#111111" />
                          <circle cx="14" cy="14" r="4" fill="#111111" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-xl font-bold font-serif">{plan.name}</h3>
                  </div>
                  <p
                    className={`text-[14px] leading-relaxed ${
                      isScale ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {plan.desc}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className={`w-full h-px mb-8 ${isScale ? 'bg-neutral-800' : 'bg-[#E5E5E5]'}`}
                />

                {/* Features List */}
                <ul className="flex-1 flex flex-col gap-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      {/* Check icon */}
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${isScale ? 'text-red-500' : 'text-neutral-700'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span
                        className={`text-[14px] ${isScale ? 'text-neutral-300' : 'text-neutral-700'}`}
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-[2.2rem] font-bold tracking-tight font-serif">
                    {plan.price}
                  </span>
                  <span
                    className={`text-[13px] uppercase tracking-wider ${
                      isScale ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {plan.period}
                  </span>
                </div>

                {/* Button */}
                <button
                  className={`
                    w-full py-4 rounded-full text-[14px] font-semibold tracking-wide shadow-md transition-all duration-300 cursor-pointer
                    ${
                      isScale
                        ? 'bg-white text-black hover:bg-neutral-200'
                        : 'bg-black text-white hover:bg-neutral-800'
                    }
                  `}
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
