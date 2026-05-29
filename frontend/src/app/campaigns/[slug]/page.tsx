 'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CampaignDetailPage as CampaignDetailPageContent } from '@/features/campaigns/CampaignDetailPage';
import { ApiRequestError, getCampaignBySlug } from '@/features/campaigns/api/campaigns.api';
import { mapCampaignToUiModel } from '@/features/campaigns/lib/campaign-mappers';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbCampaignDetail } from '@/components/layout/breadcrumb.presets';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import CampaignNotFoundPage from './not-found';

export default function CampaignSlugPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const campaignQuery = useQuery({
    enabled: Boolean(slug),
    queryKey: ['campaign-detail', slug],
    queryFn: () => getCampaignBySlug(slug),
    retry: 1,
  });

  const campaign = campaignQuery.data ? mapCampaignToUiModel(campaignQuery.data) : null;

  if (campaignQuery.isError) {
    if (
      campaignQuery.error instanceof ApiRequestError &&
      campaignQuery.error.status === 404
    ) {
      return <CampaignNotFoundPage />;
    }
  }

  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip
          items={breadcrumbCampaignDetail(campaign?.title ?? 'Campaign detail')}
        />
        {campaignQuery.isLoading || campaignQuery.isFetching ? (
          <div className="bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="h-64 animate-pulse rounded-2xl border border-neutral-200 bg-white" />
            </div>
          </div>
        ) : campaignQuery.isError || !campaign ? (
          <div className="bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center">
              <h2 className="text-2xl font-bold text-neutral-950">
                Campaign details unavailable
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {campaignQuery.error instanceof Error
                  ? campaignQuery.error.message
                  : 'Unable to load this campaign right now.'}
              </p>
            </div>
          </div>
        ) : (
          <CampaignDetailPageContent campaign={campaign} />
        )}
      </div>
      <Footer />
    </>
  );
}
