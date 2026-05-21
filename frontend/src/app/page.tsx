import { AboutSection } from '@/components/landing/AboutSection';
import { CTASection } from '@/components/landing/CTASection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { StatsSection } from '@/components/landing/StatsSection';
import { SuccessStories } from '@/components/landing/SuccessStories';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-slate-900 pt-16 text-neutral-950 sm:pt-18">
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <SuccessStories />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
