import TopBar from '@/components/TopBar';
import MainHeadline from '@/components/MainHeadline';
import StatusBar from '@/components/StatusBar';
import Scene from '@/components/Scene';
import StickerPhysics from '@/components/StickerPhysics';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Background blueprint grid */}
      <div className="blueprint-grid" />

      {/* React Three Fiber Scene for the 3D GLB */}
      <Scene />

      {/* UI Overlay */}
      <TopBar />
      <MainHeadline />
      <StatusBar />

      {/* Matter.js Sticker Spawner */}
      <StickerPhysics />
    </main>
  );
}
