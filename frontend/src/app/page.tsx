import { ActionCards } from '@/components/landing/ActionCards';
import { DonorPreview } from '@/components/landing/DonorPreview';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { StatsSection } from '@/components/landing/StatsSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <HeroSection />
        <ActionCards />
        <DonorPreview />
        <HowItWorks />
        <StatsSection />
      </main>
      <Footer />
    </>
  );
}

