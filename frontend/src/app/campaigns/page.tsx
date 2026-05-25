import type { Metadata } from 'next';
import { CampaignsPageContent } from '@/features/campaigns/components/CampaignsPageContent';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbCampaigns } from '@/components/layout/breadcrumb.presets';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Blood Donation Campaigns | LifeDrop',
  description:
    'Find blood donation drives and camps near you. Filter by city, state, status, and month.',
};

export default function CampaignsPage() {
  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbCampaigns} />
        <CampaignsPageContent />
      </div>
      <Footer />
    </>
  );
}
