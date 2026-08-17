"use client";

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      setTime(date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10 pointer-events-none text-white">
      {/* Left: Clock */}
      <div className="text-xs font-mono font-medium tracking-wide">
        <span className="text-white/50 mr-2">GMT+7</span>
        {time || '--:--'}
      </div>

      {/* Right: Pricing / Promo Chip */}
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {/* Main Promo Card */}
        <div className="bg-[#111111] text-white p-2 rounded-xl flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform cursor-pointer">
          <div className="bg-white/10 rounded-lg p-1.5 w-12 h-10 flex items-center justify-center overflow-hidden">
             {/* Abstract mini visual */}
             <div className="flex gap-0.5">
               <div className="w-1.5 h-6 bg-red-400 rounded-full mix-blend-screen" />
               <div className="w-1.5 h-6 bg-blue-400 rounded-full mix-blend-screen -mt-2" />
               <div className="w-1.5 h-6 bg-purple-400 rounded-full mix-blend-screen mt-1" />
             </div>
          </div>
          <div className="pr-3">
            <div className="text-sm font-bold leading-tight">Orionix</div>
            <div className="text-[10px] text-gray-400">only <span className="text-white font-bold">$99</span></div>
          </div>
        </div>

        {/* Made in Framer (or React) badge */}
        <div className="bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-100 flex items-center gap-2 text-xs font-medium cursor-pointer hover:bg-gray-50 transition-colors">
          <Sparkles size={12} className="text-black" />
          Made in React
        </div>
      </div>
    </div>
  );
}
