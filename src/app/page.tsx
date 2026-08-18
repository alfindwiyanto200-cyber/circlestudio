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
    <main className="relative w-full bg-[#FAFAFA] text-[#111111] selection:bg-black selection:text-white">
      {/* ── Section 1: Hero ── */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background GIF */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_bg.gif"
            alt="Holographic glass disks moving background"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
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
