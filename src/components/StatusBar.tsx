import React, { useEffect, useState } from 'react';

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
    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10 pointer-events-none text-black">
      {/* Left: Clock */}
      <div className="text-xs font-mono font-medium tracking-wide">
        <span className="text-black/50 mr-2">GMT+7</span>
        {time || '--:--'}
      </div>
    </div>
  );
}
