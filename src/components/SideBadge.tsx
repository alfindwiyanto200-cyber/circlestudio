import React from 'react';

export default function SideBadge() {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-auto select-none">
      <img
        src="/pinggir-kiri.png"
        alt="Side Badge"
        className="w-[40px] md:w-[50px] h-auto object-contain"
      />
    </div>
  );
}
