import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CampaignDetailPage as CampaignDetailPageContent } from '@/features/campaigns/CampaignDetailPage';
import {
  getAllCampaignSlugs,
  getCampaignBySlug,
} from '@/features/campaigns/data/campaigns.data';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbCampaignDetail } from '@/components/layout/breadcrumb.presets';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

type CampaignDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllCampaignSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CampaignDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return { title: 'Campaign not found | LifeDrop' };
  }

  const campaign = getCampaignBySlug(slug);

  if (!campaign) {
    return { title: 'Campaign not found | LifeDrop' };
  }

  return {
    title: `${campaign.title} | Campaign detail · LifeDrop`,
    description: campaign.shortDescription,
  };
}

export default async function CampaignSlugPage({ params }: CampaignDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  const campaign = getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbCampaignDetail(campaign.title)} />
        <CampaignDetailPageContent campaign={campaign} />
      </div>
      <Footer />
    </>
  );
}
