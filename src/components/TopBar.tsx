import React from 'react';
import { Sun } from 'lucide-react'; // Using Sun as a substitute for radial flare

export default function TopBar() {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-auto text-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Sun className="text-red-500" size={28} strokeWidth={2.5} />
        <span className="font-sans font-bold text-xl tracking-tight">orionix</span>
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
      <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors shadow-lg">
        Book a call
      </button>
    </div>
  );
}
