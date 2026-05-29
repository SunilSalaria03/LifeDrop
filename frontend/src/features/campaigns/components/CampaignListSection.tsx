'use client';

import { CalendarX2, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonorListPagination } from '@/components/landing/DonorListPagination';
import { CAMPAIGN_PAGE_SIZE } from '../lib/campaign-filters';
import { BloodDonationCampaign } from '../types/campaign.types';
import { CampaignCard } from './CampaignCard';

type CampaignListSectionProps = {
  campaigns: BloodDonationCampaign[];
  totalCount: number;
  page: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  hasActiveFilters: boolean;
  onViewAll: () => void;
  isLoading?: boolean;
  showOwnerActions?: boolean;
  deletingCampaignId?: string | null;
  onDeleteCampaign?: (campaign: BloodDonationCampaign) => void;
  onEditCampaign?: (campaign: BloodDonationCampaign) => void;
};

function formatCampaignCountLabel(totalCount: number): string {
  if (totalCount === 0) {
    return 'No campaigns listed';
  }

  return `${totalCount} ${totalCount === 1 ? 'campaign' : 'campaigns'} available`;
}

function formatRangeLabel(
  page: number,
  pageSize: number,
  totalCount: number,
): string {
  if (totalCount === 0) {
    return '';
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return `Showing ${start}–${end} of ${totalCount}`;
}

export function CampaignListSection({
  campaigns,
  totalCount,
  page,
  totalPages,
  pageSize = CAMPAIGN_PAGE_SIZE,
  onPageChange,
  hasActiveFilters,
  onViewAll,
  isLoading = false,
  showOwnerActions = false,
  deletingCampaignId = null,
  onDeleteCampaign,
  onEditCampaign,
}: CampaignListSectionProps) {
  const resolvedTotalPages =
    totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));
  const rangeLabel = formatRangeLabel(page, pageSize, totalCount);
  const campaignCountLabel = formatCampaignCountLabel(totalCount);

  return (
    <section className="bg-neutral-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid max-w-2xl gap-2">
            <p className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-700 shadow-sm sm:px-4 sm:tracking-[0.14em]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
                <Megaphone className="h-4 w-4" aria-hidden />
              </span>
              Campaign directory
            </p>
            <h2 className="text-2xl font-bold tracking-normal text-neutral-950 sm:text-3xl">
              Donation drives in your area
            </h2>
            <p className="text-sm leading-6 text-neutral-600">
              Review upcoming and ongoing blood donation camps. Select a campaign
              to view venue information, dates, capacity, and registration
              guidance.
            </p>
            {rangeLabel ? (
              <p className="text-sm font-medium text-neutral-500">{rangeLabel}</p>
            ) : null}
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm font-medium text-neutral-700">
            <Megaphone className="h-4 w-4 text-neutral-500" aria-hidden />
            {campaignCountLabel}
          </span>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="h-[330px] animate-pulse rounded-2xl border border-neutral-200 bg-white"
                key={`campaign-skeleton-${index}`}
              />
            ))}
          </div>
        ) : totalCount === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <CalendarX2 className="h-8 w-8" aria-hidden />
            </div>
            <h3 className="mt-6 text-xl font-bold text-neutral-950">
              No matching campaigns
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
              {hasActiveFilters
                ? 'No donation drives match your current filters. Adjust your search criteria or view the full directory.'
                : 'No campaigns are listed at this time. Please check back soon for new donation drives in your region.'}
            </p>
            {hasActiveFilters ? (
              <Button
                className="mt-8 h-11 rounded-full bg-red-700 px-6 hover:bg-red-800"
                onClick={onViewAll}
                type="button"
              >
                View full directory
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {campaigns.map((campaign) => (
                <CampaignCard
                  campaign={campaign}
                  isDeleting={deletingCampaignId === campaign.id}
                  key={campaign.id}
                  onDelete={onDeleteCampaign}
                  onEdit={onEditCampaign}
                  showOwnerActions={showOwnerActions}
                />
              ))}
            </div>

            <DonorListPagination
              ariaLabel="Campaign results pagination"
              className="pt-8"
              onPageChange={onPageChange}
              page={page}
              totalPages={resolvedTotalPages}
            />
          </>
        )}
      </div>
    </section>
  );
}
