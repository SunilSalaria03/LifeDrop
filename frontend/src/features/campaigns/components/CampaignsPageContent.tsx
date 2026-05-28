'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { State } from 'country-state-city';
import { Button } from '@/components/ui/button';
import { getCampaigns } from '../api/campaigns.api';
import { mapCampaignToUiModel } from '../lib/campaign-mappers';
import {
  CAMPAIGN_PAGE_SIZE,
  EMPTY_CAMPAIGN_FILTERS,
  getCampaignMonthOptions,
} from '../lib/campaign-filters';
import { CampaignFilterValues } from '../types/campaign.types';
import { CampaignFilters } from './CampaignFilters';
import { CampaignHero } from './CampaignHero';
import { CampaignListSection } from './CampaignListSection';

export function CampaignsPageContent() {
  const [draftFilters, setDraftFilters] =
    useState<CampaignFilterValues>(EMPTY_CAMPAIGN_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<CampaignFilterValues>(EMPTY_CAMPAIGN_FILTERS);
  const [page, setPage] = useState(1);

  const campaignQuery = useQuery({
    queryKey: ['campaigns', appliedFilters, page],
    queryFn: () =>
      getCampaigns({
        search: appliedFilters.search.trim() || undefined,
        type:
          appliedFilters.type !== 'all'
            ? (appliedFilters.type as 'blood_donation' | 'awareness' | 'health_checkup')
            : undefined,
        city: appliedFilters.city.trim() || undefined,
        state: appliedFilters.state !== 'all' ? appliedFilters.state : undefined,
        status:
          appliedFilters.status !== 'all'
            ? (appliedFilters.status as
                | 'upcoming'
                | 'ongoing'
                | 'completed'
                | 'draft'
                | 'pending'
                | 'approved'
                | 'cancelled')
            : undefined,
        month: appliedFilters.month !== 'all' ? appliedFilters.month : undefined,
        page,
        limit: CAMPAIGN_PAGE_SIZE,
        sortBy: 'startDate',
        sortOrder: 'desc',
      }),
  });

  const campaigns = useMemo(
    () => (campaignQuery.data?.items ?? []).map(mapCampaignToUiModel),
    [campaignQuery.data?.items],
  );

  const stateOptions = useMemo(
    () => [
      { value: 'all', label: 'All states' },
      ...State.getStatesOfCountry('IN').map((state) => ({
        value: state.name,
        label: state.name,
      })),
    ],
    [],
  );
  const monthOptions = useMemo(() => getCampaignMonthOptions(campaigns), [campaigns]);

  const totalCount = campaignQuery.data?.count ?? 0;
  const totalPages = Math.max(1, campaignQuery.data?.totalPages ?? 1);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const hasActiveFilters =
    appliedFilters.search.trim() !== '' ||
    appliedFilters.type !== 'all' ||
    appliedFilters.city.trim() !== '' ||
    appliedFilters.state !== 'all' ||
    appliedFilters.status !== 'all' ||
    appliedFilters.month !== 'all';

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters });
    setPage(1);
  };

  const handleClear = () => {
    setDraftFilters(EMPTY_CAMPAIGN_FILTERS);
    setAppliedFilters(EMPTY_CAMPAIGN_FILTERS);
    setPage(1);
  };

  const handleViewAll = () => {
    handleClear();
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    document.getElementById('campaign-results')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <CampaignHero
        filters={
          <CampaignFilters
            filters={draftFilters}
            monthOptions={monthOptions}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            stateOptions={stateOptions}
          />
        }
      />
      <div id="campaign-results">
        {campaignQuery.isError ? (
          <section className="bg-neutral-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center">
                <h3 className="text-xl font-bold text-neutral-950">
                  Campaigns unavailable
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
                  {campaignQuery.error instanceof Error
                    ? campaignQuery.error.message
                    : 'Unable to load campaigns right now.'}
                </p>
                <Button
                  className="mt-8 h-11 rounded-full bg-red-700 px-6 hover:bg-red-800"
                  onClick={() => campaignQuery.refetch()}
                  type="button"
                >
                  Retry
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <CampaignListSection
            campaigns={campaigns}
            hasActiveFilters={hasActiveFilters}
            onPageChange={handlePageChange}
            onViewAll={handleViewAll}
            page={page}
            totalCount={totalCount}
            isLoading={campaignQuery.isLoading || campaignQuery.isFetching}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  );
}
