import Image from 'next/image';
import TopBar from '@/components/TopBar';
import MainHeadline from '@/components/MainHeadline';
import StatusBar from '@/components/StatusBar';
import Scene from '@/components/Scene';
import SideBadge from '@/components/SideBadge';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">
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
    </main>
  );
}
