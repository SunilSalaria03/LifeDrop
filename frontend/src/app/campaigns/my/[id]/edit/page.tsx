'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbEditCampaign } from '@/components/layout/breadcrumb.presets';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getMyCampaignById } from '@/features/campaigns/api/campaigns.api';
import { CreateCampaignForm } from '@/features/campaigns/components/CreateCampaignForm';
import { mapCampaignToUiModel } from '@/features/campaigns/lib/campaign-mappers';

export default function EditMyCampaignPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params.id;
  const { user, isAuthLoading } = useAuth();

  const campaignQuery = useQuery({
    enabled: Boolean(user && campaignId),
    queryKey: ['campaigns', 'me', 'edit', campaignId],
    queryFn: () => getMyCampaignById(campaignId),
    retry: 1,
  });

  useEffect(() => {
    if (!user && !isAuthLoading) {
      window.dispatchEvent(
        new CustomEvent('lifedrop:open-auth-modal', {
          detail: { redirect: `/campaigns/my/${campaignId}/edit` },
        }),
      );
    }
  }, [campaignId, isAuthLoading, user]);

  const campaign = campaignQuery.data ? mapCampaignToUiModel(campaignQuery.data) : null;

  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbEditCampaign(campaign?.title)} />
        <HeroSection />
      </div>
      <main className="min-h-screen bg-neutral-50 px-4 pb-12 pt-10 text-neutral-950 sm:px-6 sm:pt-12 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          {!user && !isAuthLoading ? (
            <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center">
              <h1 className="text-2xl font-bold text-neutral-950">Login required</h1>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Please login to edit your campaign.
              </p>
            </div>
          ) : campaignQuery.isLoading || campaignQuery.isFetching ? (
            <div className="h-72 animate-pulse rounded-2xl border border-neutral-200 bg-white" />
          ) : campaignQuery.isError || !campaign ? (
            <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center">
              <h1 className="text-2xl font-bold text-neutral-950">
                Unable to load campaign
              </h1>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {campaignQuery.error instanceof Error
                  ? campaignQuery.error.message
                  : 'Please try again later.'}
              </p>
            </div>
          ) : (
            <CreateCampaignForm
              campaign={campaign}
              campaignId={campaign.id}
              mode="edit"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
