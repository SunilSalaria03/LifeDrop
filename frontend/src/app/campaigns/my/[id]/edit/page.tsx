'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbEditCampaign } from '@/components/layout/breadcrumb.presets';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getMyCampaignById } from '@/features/campaigns/api/campaigns.api';
import { CreateCampaignForm } from '@/features/campaigns/components/CreateCampaignForm';
import { mapCampaignToUiModel } from '@/features/campaigns/lib/campaign-mappers';
import { profileCard, profileCardBody } from '@/app/profile/profile-card.styles';

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
        <div className="relative mx-auto grid w-full max-w-7xl gap-6">
          <Card className={profileCard}>
            <CardContent className={profileCardBody}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-red-50 sm:h-24 sm:w-24">
                  <Megaphone className="h-9 w-9 text-red-700 sm:h-10 sm:w-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-red-700">
                    Update your campaign
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                    {campaign?.title || 'Edit campaign details'}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Keep your campaign information up to date so donors always see
                    the latest schedule and contact details.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="rounded-md border border-neutral-200 bg-neutral-50 font-medium text-neutral-700">
                      Owner access
                    </Badge>
                    <Badge className="rounded-md border border-green-200 bg-green-50 font-medium text-green-800">
                      Live campaign edits
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
