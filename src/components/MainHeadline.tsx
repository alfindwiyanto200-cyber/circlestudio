import React from 'react';

export default function MainHeadline() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none text-center pt-10">
      <h1 className="font-serif text-[6rem] md:text-[8rem] lg:text-[10rem] leading-[0.9] tracking-tight text-black">
        Crafting Identity,<br />
        Driving Growth.
      </h1>

      <p className="mt-8 max-w-md text-black/70 font-sans text-lg">
        Designing brands, products, and campaigns built for a digital-first world.
      </p>
    </div>
  );
}
