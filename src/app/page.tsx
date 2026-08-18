import Image from 'next/image';
import TopBar from '@/components/TopBar';
import MainHeadline from '@/components/MainHeadline';
import StatusBar from '@/components/StatusBar';
import Scene from '@/components/Scene';
import SideBadge from '@/components/SideBadge';
import OurClients from '@/components/OurClients';
import FeaturedWork from '@/components/FeaturedWork';
import HowWeWork from '@/components/HowWeWork';

export default function Home() {
  return (
    <main className="relative w-screen overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      {/* ── Section 1: Hero ── */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/gambar baground.png"
            alt="Glass Rings Background"
            fill
            priority
            className="object-cover object-center"
            quality={95}
          />
        </div>

        {/* React Three Fiber Scene for the Glass Discs (overlaid, transparent) */}
        <Scene />

        {/* UI Overlay */}
        <TopBar />
        <MainHeadline />
        <StatusBar />
        <SideBadge />
      </section>

      {/* ── Section 2: Our Clients ── */}
      <OurClients />

      {/* ── Section 3: Featured Work ── */}
      <FeaturedWork />

      {/* ── Section 4: How We Work ── */}
      <HowWeWork />
    </main>
  );
}
