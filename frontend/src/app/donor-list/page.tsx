import { Suspense } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { DonorSearchResultsSkeletonShell } from '@/components/landing/DonorSearchResultsSkeletonShell';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbDonorList } from '@/components/layout/breadcrumb.presets';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

function DonorListHeroFallback() {
  return (
    <>
      <section className="min-h-[700px] animate-pulse bg-slate-900" aria-hidden />
      <DonorSearchResultsSkeletonShell mode="paginated" pageSize={12} />
    </>
  );
}

export default function DonorListPage() {
  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbDonorList} />
        <Suspense fallback={<DonorListHeroFallback />}>
          <HeroSection />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
