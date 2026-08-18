import Image from 'next/image';
import TopBar from '@/components/TopBar';
import MainHeadline from '@/components/MainHeadline';
import StatusBar from '@/components/StatusBar';
import SideBadge from '@/components/SideBadge';
import OurClients from '@/components/OurClients';
import FeaturedWork from '@/components/FeaturedWork';
import DialServices from '@/components/DialServices';
import HowWeWork from '@/components/HowWeWork';
import Pricing from '@/components/Pricing';
import ClientVoicesInsights from '@/components/ClientVoicesInsights';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative w-full bg-black text-white selection:bg-white selection:text-black">
      {/* ── Section 1: Hero ── */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background GIF */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Holographic_glass_disks_moving_s…_202608181602.gif"
            alt="Holographic glass disks moving background"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
        </div>

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

      {/* ── Section 4: Dial Services ── */}
      <DialServices />

      {/* ── Section 5: How We Work ── */}
      <HowWeWork />

      {/* ── Section 6: Pricing ── */}
      <Pricing />

      {/* ── Section 7: Client Voices & Insights ── */}
      <ClientVoicesInsights />

      {/* ── Footer ── */}
      <Footer />
    </main>
  );
}
