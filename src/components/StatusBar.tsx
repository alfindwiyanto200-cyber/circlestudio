"use client";

import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export default function StatusBar() {
  const [time, setTime] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Update time
    const interval = setInterval(() => {
      const date = new Date();
      setTime(date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    
    // Initial set
    setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));

    // Mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Format coordinates to always be 4 digits
  const formatCoord = (val: number) => val.toString().padStart(4, '0');

  return (
    <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end z-10 pointer-events-none uppercase text-xs tracking-wider opacity-80">
      {/* Left */}
      <div className="w-1/3">
        GMT+8 CN {time || '--:--'} 27°C
      </div>

      {/* Center */}
      <div className="w-1/3 flex justify-center">
        {formatCoord(mousePos.x)} X {formatCoord(mousePos.y)} Y
      </div>

      {/* Right */}
      <div className="w-1/3 flex justify-end">
        <Globe size={24} strokeWidth={1} />
      </div>
    </div>
  );
}
