import { Suspense } from 'react';
import { AboutSection } from '@/components/landing/AboutSection';
import { CTASection } from '@/components/landing/CTASection';
import { HeroSection } from '@/components/landing/HeroSection';
import { DonorSearchResultsSkeletonShell } from '@/components/landing/DonorSearchResultsSkeletonShell';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { StatsSection } from '@/components/landing/StatsSection';
import { SuccessStories } from '@/components/landing/SuccessStories';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

function HomeHeroFallback() {
  return (
    <>
      <section className="min-h-[700px] animate-pulse bg-slate-900" aria-hidden />
      <DonorSearchResultsSkeletonShell mode="preview" pageSize={6} />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-slate-900 pt-16 text-neutral-950 sm:pt-18">
        <Suspense fallback={<HomeHeroFallback />}>
          <HeroSection />
        </Suspense>
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
