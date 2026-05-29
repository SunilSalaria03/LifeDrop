'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbMyCampaigns } from '@/components/layout/breadcrumb.presets';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { getMyCampaigns } from '@/features/campaigns/api/campaigns.api';
import { CAMPAIGN_PAGE_SIZE } from '@/features/campaigns/constants/campaign.constants';
import { mapCampaignToUiModel } from '@/features/campaigns/lib/campaign-mappers';
import { CampaignListSection } from '@/features/campaigns/components/CampaignListSection';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function MyCampaignsPage() {
  const { user, isAuthLoading } = useAuth();
  const [page, setPage] = useState(1);
  const myCampaignsQuery = useQuery({
    enabled: Boolean(user),
    queryKey: ['campaigns', 'me', page],
    queryFn: () =>
      getMyCampaigns({
        page,
        limit: CAMPAIGN_PAGE_SIZE,
      }),
    retry: 1,
  });

  useEffect(() => {
    if (!user && !isAuthLoading) {
      window.dispatchEvent(
        new CustomEvent('lifedrop:open-auth-modal', {
          detail: { redirect: '/campaigns/my' },
        }),
      );
    }
  }, [isAuthLoading, user]);

  const campaigns = (myCampaignsQuery.data?.items ?? []).map(mapCampaignToUiModel);

  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbMyCampaigns} />
      </div>
      <main className="bg-neutral-50">
        {!user && !isAuthLoading ? (
          <section className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center">
              <h1 className="text-2xl font-bold text-neutral-950">
                Login required
              </h1>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Please login to view your campaigns.
              </p>
            </div>
          </section>
        ) : myCampaignsQuery.isError ? (
          <section className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center">
              <h1 className="text-2xl font-bold text-neutral-950">
                Unable to load campaigns
              </h1>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {myCampaignsQuery.error instanceof Error
                  ? myCampaignsQuery.error.message
                  : 'Please try again later.'}
              </p>
            </div>
          </section>
        ) : (
          <CampaignListSection
            campaigns={campaigns}
            hasActiveFilters={false}
            isLoading={myCampaignsQuery.isLoading || myCampaignsQuery.isFetching}
            onPageChange={setPage}
            onViewAll={() => undefined}
            page={page}
            totalCount={myCampaignsQuery.data?.count ?? 0}
            totalPages={myCampaignsQuery.data?.totalPages ?? 1}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
