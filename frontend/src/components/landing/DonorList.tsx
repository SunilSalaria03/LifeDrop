'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, UserSearch, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RequestBloodModal } from '@/features/donors/components/RequestBloodModal';
import { DonorListItem } from '@/features/donors/types/donor.types';
import { userStorage } from '@/lib/auth/user-storage';
import { DonorCard } from './DonorCard';
import { DonorListPagination } from './DonorListPagination';
import { DonorListProps } from './landing.types';

function DonorSkeletonCard() {
  return (
    <Card
      aria-hidden
      className="overflow-hidden rounded-2xl border-neutral-200 shadow-sm"
    >
      <CardContent className="flex h-full animate-pulse flex-col p-5 sm:p-6">
        <div className="flex items-start gap-4 border-b border-neutral-200 pb-4">
          <div className="h-14 w-14 shrink-0 rounded-full bg-neutral-200" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-5 w-32 max-w-full rounded-md bg-neutral-200" />
            <div className="h-4 w-44 max-w-full rounded-md bg-neutral-100" />
            <div className="h-3 w-28 max-w-full rounded-md bg-neutral-100" />
          </div>
          <div className="h-7 w-12 shrink-0 rounded-md bg-neutral-200" />
        </div>
        <div className="divide-y divide-neutral-200 py-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between gap-4 py-2.5">
              <div className="h-4 w-20 rounded-md bg-neutral-100" />
              <div className="h-4 w-24 rounded-md bg-neutral-200" />
            </div>
          ))}
        </div>
        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
          <div className="h-10 rounded-full border border-neutral-200 bg-neutral-50 sm:h-11" />
          <div className="h-10 rounded-full bg-neutral-200 sm:h-11" />
        </div>
      </CardContent>
    </Card>
  );
}

function formatDonorCountLabel(totalCount: number, isLoading: boolean): string {
  if (isLoading) {
    return 'Searching…';
  }

  return `${totalCount} ${totalCount === 1 ? 'donor' : 'donors'}`;
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

export function DonorList({
  donors,
  isLoading,
  hasSearched,
  errorMessage,
  mode = 'paginated',
  totalCount = donors.length,
  page = 1,
  totalPages = 1,
  pageSize = 12,
  onPageChange,
  viewAllHref,
  showViewAll = false,
}: DonorListProps) {
  const { meQuery } = useAuth();
  const [selectedDonor, setSelectedDonor] = useState<DonorListItem | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  if (!hasSearched) {
    return null;
  }

  const isPreview = mode === 'preview';
  const skeletonCount = isPreview ? 6 : pageSize;
  const donorCountLabel = isPreview
    ? isLoading
      ? 'Searching…'
      : totalCount > donors.length
        ? `Showing ${donors.length} of ${totalCount} donors`
        : formatDonorCountLabel(totalCount, isLoading)
    : formatDonorCountLabel(totalCount, isLoading);

  const rangeLabel =
    !isPreview && totalCount > 0
      ? formatRangeLabel(page, pageSize, totalCount)
      : null;

  const handleRequest = (donor: DonorListItem) => {
    if (!meQuery.data && !userStorage.getUser()) {
      window.dispatchEvent(new CustomEvent('lifedrop:open-auth-modal'));
      return;
    }

    setSelectedDonor(donor);
    setIsRequestModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsRequestModalOpen(open);

    if (!open) {
      setSelectedDonor(null);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 text-left">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid max-w-2xl gap-2">
          <p className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-700 shadow-sm sm:px-4 sm:tracking-[0.14em]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
              <UserSearch className="h-4 w-4" aria-hidden />
            </span>
            Search results
          </p>
          <h2 className="text-2xl font-bold tracking-normal text-neutral-950 sm:text-3xl">
            Donors in your area
          </h2>
          <p className="text-sm leading-6 text-neutral-600">
            Compare distance and availability, then request blood or open a
            profile.
          </p>
          {rangeLabel ? (
            <p className="text-sm font-medium text-neutral-500">{rangeLabel}</p>
          ) : null}
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm font-medium text-neutral-700">
          <UsersRound className="h-4 w-4 text-neutral-500" aria-hidden />
          {donorCountLabel}
        </span>
      </div>

      {isLoading ? (
        <div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-busy="true"
          aria-label="Loading donor results"
          role="status"
        >
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <DonorSkeletonCard key={index} />
          ))}
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800">
            Search unavailable
          </h3>
          <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
        </div>
      ) : donors.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <h3 className="text-lg font-semibold text-neutral-950">
            No donors found
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
            Try another blood group, city, or nearby district to widen your
            search.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {donors.map((donor) => (
              <DonorCard
                donor={donor}
                hideRequestButton={Boolean(
                  meQuery.data?.id && donor.userId === meQuery.data.id,
                )}
                key={donor.id}
                onRequest={handleRequest}
              />
            ))}
          </div>

          {showViewAll && viewAllHref ? (
            <div className="flex justify-center pt-2">
              <Button
                asChild
                className="h-11 gap-2 px-6"
              >
                <Link href={viewAllHref}>
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : null}

          {!isPreview && onPageChange ? (
            <DonorListPagination
              isLoading={isLoading}
              onPageChange={onPageChange}
              page={page}
              totalPages={totalPages}
            />
          ) : null}
        </>
      )}

      <RequestBloodModal
        donor={selectedDonor}
        onOpenChange={handleModalOpenChange}
        onSuccess={() => handleModalOpenChange(false)}
        open={isRequestModalOpen}
      />
    </div>
  );
}
