import React from 'react';
import Link from 'next/link';

export default function TopBar() {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-auto text-black">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1 cursor-pointer">
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
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link href="/works" className="hover:opacity-70 transition-opacity cursor-pointer">
          Works
        </Link>
        <Link href="/#about" className="hover:opacity-70 transition-opacity cursor-pointer">
          About
        </Link>
        <Link href="/#pricing" className="hover:opacity-70 transition-opacity cursor-pointer">
          Pricing
        </Link>
        <Link href="/#how-we-work" className="hover:opacity-70 transition-opacity cursor-pointer">
          Services
        </Link>
        <Link href="/#blog" className="hover:opacity-70 transition-opacity cursor-pointer">
          Blog
        </Link>
        <Link href="/#pages" className="hover:opacity-70 transition-opacity cursor-pointer">
          Pages
        </Link>
      </nav>

      {/* CTA */}
      <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer">
        Book a call
      </button>
    </div>
  );
}
