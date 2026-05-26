import type { Metadata } from 'next';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbCreateCampaign } from '@/components/layout/breadcrumb.presets';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { CreateCampaignForm } from '@/features/campaigns/components/CreateCampaignForm';

export const metadata: Metadata = {
  title: 'Create a Campaign | LifeDrop',
  description:
    'List a blood donation drive or camp on LifeDrop so donors can find and join your campaign.',
};

export default function CreateCampaignPage() {
  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbCreateCampaign} />
        <HeroSection />
      </div>
      <main className="min-h-screen bg-neutral-50 px-4 pb-12 pt-10 text-neutral-950 sm:px-6 sm:pt-12 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <CreateCampaignForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
