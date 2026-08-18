import React from 'react';

export default function TopBar() {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-auto text-black">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/logo-3d.gif"
          alt="3D Animated Logo"
          className="w-12 h-12 object-contain pointer-events-none"
        />
        <img
          src="/logo-text.png"
          alt="circle"
          className="h-[26px] object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <button className="hover:opacity-70 transition-opacity">Works</button>
        <button className="hover:opacity-70 transition-opacity">About</button>
        <button className="hover:opacity-70 transition-opacity">Pricing</button>
        <button className="hover:opacity-70 transition-opacity">Services</button>
        <button className="hover:opacity-70 transition-opacity">Blog</button>
        <button className="hover:opacity-70 transition-opacity">Pages</button>
      </nav>

      {/* CTA */}
      <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors shadow-lg">
        Book a call
      </button>
    </div>
  );
}
