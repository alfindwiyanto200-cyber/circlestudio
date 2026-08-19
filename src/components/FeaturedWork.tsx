'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Types
interface Project {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  image?: string;
}

// Project database
const PROJECTS: Project[] = [
  // Row 1 (2 items - Featured / Wide)
  {
    id: 'rivermark',
    title: 'Rivermark',
    desc: 'Bold street branding campaign designed to capture attention and energize urban audiences.',
    tags: ['Website', 'Social Media'],
    image: '', // Can be filled with image URL later
  },
  {
    id: 'fluxa',
    title: 'Fluxa',
    desc: 'Dynamic digital visuals and identity crafted for modern and expressive brands.',
    tags: ['UX/UI', 'Growth'],
    image: '', // Can be filled with image URL later
  },
  // Row 2 (3 items)
  {
    id: 'river',
    title: 'River',
    desc: 'Immersive visual branding designed for large-scale digital and experiential displays.',
    tags: ['Website', 'Growth'],
    image: '',
  },
  {
    id: 'season',
    title: 'Season',
    desc: 'Modern ecommerce experience designed for clarity, speed, and engaging product storytelling.',
    tags: ['Website', 'UX/UI'],
    image: '',
  },
  {
    id: 'axn',
    title: 'AXN',
    desc: 'Minimal streetwear identity designed to express bold attitude and contemporary culture.',
    tags: ['Branding', 'Social Media'],
    image: '',
  },
  // Row 3 (3 items)
  {
    id: 'nova',
    title: 'Nova',
    desc: 'Clean product interface designed to simplify complex digital interactions.',
    tags: ['UX/UI', 'Website', 'Growth'],
    image: '',
  },
  {
    id: 'lumen-studio',
    title: 'Lumen Studio',
    desc: 'Brand identity and digital experience for a boutique creative studio.',
    tags: ['Branding', 'UX/UI', 'Social Media'],
    image: '',
  },
  {
    id: 'northbound',
    title: 'Northbound',
    desc: 'Editorial-led website redesign for an outdoor lifestyle label.',
    tags: ['Social Media', 'UX/UI', 'Website'],
    image: '',
  },
];

// SVG Search Icon
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-neutral-400"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// SVG Chevron Down Icon
const ChevronDownIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-neutral-400"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  // States for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5); // Start with 5 projects (Row 1 + Row 2)

  const categories = ['All', 'Website', 'UX/UI', 'Growth', 'Branding', 'Social Media'];

  // Filtering Logic
  const filteredProjects = PROJECTS.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      project.tags.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = filteredProjects.length > visibleCount;

  // Staggered motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  };

  // Stagger dynamic grids
  const featuredRow = visibleProjects.slice(0, 2);
  const archiveGrid = visibleProjects.slice(2);

  const handleLoadMore = () => {
    setVisibleCount(PROJECTS.length); // Reveal all 8 projects
  };

  return (
    <section
      ref={sectionRef}
      id="featured-work"
      className="relative w-full bg-[#FAFAFA] border-t border-[#EBEBEB] overflow-x-hidden"
    >
      {/* Top accent hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #C8C8C8 30%, #C8C8C8 70%, transparent 100%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-24 pb-32 md:pt-32 md:pb-40">
        
        {/* ── 1. Header & Controls Section ── */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          
          {/* Section Badge (Red Dot + Featured Work) */}
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
              text-[2.6rem] md:text-[3.8rem] lg:text-[4.5rem]
              leading-[1.1] tracking-[-0.035em]
              max-w-4xl mx-auto
            "
          >
            Selected projects built with ambitious brands and bold teams
          </motion.h2>

          {/* Filter & Search Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full max-w-lg mx-auto"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-neutral-200 bg-white shadow-sm transition-all focus-within:border-neutral-400 focus-within:shadow-md w-full sm:w-[280px]">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PROJECTS.length); // auto-expand on search
                }}
                className="outline-none bg-transparent w-full text-[14px] text-neutral-800 placeholder-neutral-400 font-sans"
              />
            </div>

            {/* Dropdown Filter Pill */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-3 px-5 py-2.5 rounded-full border border-neutral-200 bg-white text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 active:scale-98 transition-all shadow-sm cursor-pointer w-full sm:w-[150px]"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                <span>{selectedCategory}</span>
                <ChevronDownIcon />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl border border-neutral-100 bg-white p-2 shadow-xl z-30 overflow-hidden text-left"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsDropdownOpen(false);
                          setVisibleCount(PROJECTS.length); // auto-expand on filter
                        }}
                        className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-neutral-900 text-white'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

        {/* ── 2 & 3. Dynamic Grid Layout & Cards ── */}
        <AnimatePresence mode="wait">
          {visibleProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-neutral-400 font-sans"
            >
              No projects match your search or filter criteria.
            </motion.div>
          ) : (
            <motion.div
              key={`${searchQuery}-${selectedCategory}-${visibleCount}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-16 md:gap-20"
            >
              {/* Row 1: Featured 2-Column Grid */}
              {featuredRow.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {featuredRow.map((project) => (
                    <ProjectCard key={project.id} project={project} variants={itemVariants} />
                  ))}
                </div>
              )}

              {/* Row 2 & 3: Archive 3-Column Grid */}
              {archiveGrid.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                  {archiveGrid.map((project) => (
                    <ProjectCard key={project.id} project={project} variants={itemVariants} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 4. Bottom Controls (Load More) ── */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mt-20"
          >
            <button
              onClick={handleLoadMore}
              className="
                px-8 py-3.5
                bg-white border border-neutral-300
                text-[#111] text-[14px] font-semibold
                rounded-full shadow-sm
                hover:bg-neutral-50 hover:border-neutral-400
                active:scale-97
                transition-all duration-300
                cursor-pointer
              "
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Load More
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
}

/* ── ProjectCard Component ── */
function ProjectCard({
  project,
  variants,
}: {
  project: Project;
  variants: any;
}) {
  return (
    <motion.article
      variants={variants}
      className="group flex flex-col cursor-default"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Media Container (16:10 aspect ratio, thick rounded corners) */}
      <div className="relative w-full aspect-[16/10] bg-neutral-950 rounded-[24px] overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-500">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          // Premium minimalist fallback background
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Subtle glow / circular aura */}
            <div className="absolute w-[60%] h-[60%] rounded-full bg-white/[0.01] filter blur-[40px] transition-all duration-700 group-hover:bg-white/[0.02] group-hover:scale-110" />
            
            {/* Minimal line-art detail */}
            <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.01] backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
              <span 
                className="text-[9px] tracking-[0.25em] text-white/20 uppercase font-sans font-bold select-none"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                C.S
              </span>
            </div>
            
            {/* Subtle hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Project Metadata (Below Media) */}
      <div className="mt-5 px-1">
        <h3 className="font-serif font-bold text-[1.65rem] text-[#111111] leading-tight tracking-[-0.02em]">
          {project.title}
        </h3>
        
        <p 
          className="mt-2 text-[14.5px] leading-relaxed text-[#666666] max-w-xl"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {project.desc}
        </p>

        {/* Category Tag Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="
                rounded-full bg-white border border-[#E5E7EB]
                px-3.5 py-1
                text-[11.5px] font-medium text-neutral-600
                shadow-sm select-none
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
