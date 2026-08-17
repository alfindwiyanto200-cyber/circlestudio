import React from 'react';

export default function SideBadge() {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-8 flex flex-col items-center gap-6 rounded-r-xl z-20 shadow-2xl">
      <div className="font-bold text-xl font-serif">W.</div>
      <div className="text-[10px] uppercase tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        Nominee
      </div>
    </div>
  );
}
