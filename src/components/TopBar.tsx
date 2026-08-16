import React from 'react';

export default function TopBar() {
  return (
    <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-10 pointer-events-none uppercase text-xs tracking-wider">
      {/* Left */}
      <div className="flex flex-col gap-6 w-1/4">
        <h1 className="font-bold text-lg pointer-events-auto">HAOQI.DESIGN</h1>
        <div className="font-sans font-semibold text-2xl normal-case leading-tight">
          Design &<br />Engineering
        </div>
      </div>

      {/* Center */}
      <div className="w-1/4 flex justify-center text-center normal-case opacity-90">
        Thinking in systems.<br />Designing with care.
      </div>

      {/* Right */}
      <div className="w-1/3 flex flex-col gap-6 pointer-events-auto">
        <nav className="flex justify-between w-full opacity-80">
          <button className="hover:text-blue-300 transition-colors">WORK</button>
          <button className="hover:text-blue-300 transition-colors">CONTACT</button>
          <button className="hover:text-blue-300 transition-colors">THEME[A]</button>
          <button className="hover:text-blue-300 transition-colors">SOUND[·]</button>
        </nav>
        <p className="normal-case opacity-90 leading-relaxed text-sm">
          I'm Haoqi Wen, leading Design Engineering and AI exploration at <span className="tracking-widest">██████</span>, engineering, and AI at scale. Outside work, I build design tools for team efficiency.
        </p>
      </div>
    </div>
  );
}
