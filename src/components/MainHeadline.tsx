import React from 'react';

export default function MainHeadline() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none text-center pt-10">
      <h1 className="font-serif text-[6rem] md:text-[8rem] lg:text-[10rem] leading-[0.9] tracking-tight text-white drop-shadow-2xl">
        We make<br />
        Creative Things.
      </h1>

      {/* Floating Toolbar Mockup */}
      <div className="mt-8 pointer-events-auto bg-black/40 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/20 rounded-full px-6 py-3 flex items-center gap-4 text-sm font-medium text-white/80">
        <button className="flex items-center gap-1 hover:text-black transition-colors">
          Heading 1 <span className="text-xs opacity-50">▾</span>
        </button>
        <div className="w-[1px] h-4 bg-white/30 mx-2" />
        <button className="font-bold hover:text-white transition-colors px-2">B</button>
        <button className="italic hover:text-white transition-colors px-2 font-serif">I</button>
        <button className="underline hover:text-white transition-colors px-2">U</button>
        <div className="w-[1px] h-4 bg-gray-300 mx-2" />
        <button className="hover:text-white transition-colors px-2 font-bold text-lg leading-none flex items-center">A <span className="text-[10px] ml-1 opacity-50">▾</span></button>
      </div>

      <p className="mt-8 max-w-md text-white/60 font-sans text-lg drop-shadow">
        Designing brands, products, and campaigns built for a digital-first world.
      </p>
    </div>
  );
}
