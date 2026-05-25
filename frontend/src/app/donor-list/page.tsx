import { Suspense } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { breadcrumbDonorList } from '@/components/layout/breadcrumb.presets';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

function DonorListHeroFallback() {
  return (
    <section className="min-h-[700px] animate-pulse bg-slate-900" aria-hidden />
  );
}

export default function DonorListPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-900 pt-16 text-neutral-950 sm:pt-18">
        <Suspense fallback={<DonorListHeroFallback />}>
          <HeroSection breadcrumb={breadcrumbDonorList} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
