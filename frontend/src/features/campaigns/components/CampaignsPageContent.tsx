'use client';

import { useEffect, useMemo, useState } from 'react';
import { CAMPAIGNS } from '../data/campaigns.data';
import {
  CAMPAIGN_PAGE_SIZE,
  EMPTY_CAMPAIGN_FILTERS,
  filterCampaigns,
  getCampaignMonthOptions,
  getCampaignStateOptions,
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

  const stateOptions = useMemo(() => getCampaignStateOptions(), []);
  const monthOptions = useMemo(() => getCampaignMonthOptions(), []);

  const filteredCampaigns = useMemo(
    () => filterCampaigns(CAMPAIGNS, appliedFilters),
    [appliedFilters],
  );

  const totalCount = filteredCampaigns.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / CAMPAIGN_PAGE_SIZE));

  const paginatedCampaigns = useMemo(() => {
    const start = (page - 1) * CAMPAIGN_PAGE_SIZE;
    return filteredCampaigns.slice(start, start + CAMPAIGN_PAGE_SIZE);
  }, [filteredCampaigns, page]);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const hasActiveFilters =
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
        <CampaignListSection
          campaigns={paginatedCampaigns}
          hasActiveFilters={hasActiveFilters}
          onPageChange={handlePageChange}
          onViewAll={handleViewAll}
          page={page}
          totalCount={totalCount}
        />
      </div>
    </>
  );
}
