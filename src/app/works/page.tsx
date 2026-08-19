import TopBar from '@/components/TopBar';
import SideBadge from '@/components/SideBadge';
import FeaturedWork from '@/components/FeaturedWork';
import Footer from '@/components/Footer';

export default function WorksPage() {
  return (
    <main className="relative w-full bg-[#FAFAFA] text-[#111111] selection:bg-black selection:text-white min-h-screen">
      {/* Global Fixed Side Badge */}
      <SideBadge />

      {/* TopBar navigation */}
      <TopBar />

      {/* Works Archive Grid - Headline, search, filter and projects */}
      <div className="pt-16 md:pt-20">
        <FeaturedWork />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
