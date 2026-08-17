import TopBar from '@/components/TopBar';
import MainHeadline from '@/components/MainHeadline';
import StatusBar from '@/components/StatusBar';
import Scene from '@/components/Scene';
import SideBadge from '@/components/SideBadge';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] text-[#111111] selection:bg-black selection:text-white">
      {/* React Three Fiber Scene for the Glass Discs */}
      <Scene />

      {/* UI Overlay */}
      <TopBar />
      <MainHeadline />
      <StatusBar />
      <SideBadge />
    </main>
  );
}
