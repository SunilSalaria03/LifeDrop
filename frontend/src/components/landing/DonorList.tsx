'use client';

import { useState } from 'react';
import { UserSearch, UsersRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RequestBloodModal } from '@/features/donors/components/RequestBloodModal';
import { DonorListItem } from '@/features/donors/types/donor.types';
import { userStorage } from '@/lib/auth/user-storage';
import { DonorCard } from './DonorCard';
import { DonorListProps } from './landing.types';

function DonorSkeletonCard() {
  return (
    <Card className="overflow-hidden rounded-2xl border-neutral-200 shadow-sm">
      <CardContent className="grid gap-4 p-5 sm:p-6">
        <div className="flex items-start gap-4 border-b border-neutral-200 pb-4">
          <div className="h-14 w-14 shrink-0 rounded-full bg-neutral-200" />
          <div className="grid flex-1 gap-2">
            <div className="h-5 w-32 rounded bg-neutral-200" />
            <div className="h-4 w-40 max-w-full rounded bg-neutral-100" />
            <div className="h-3 w-24 rounded bg-neutral-100" />
          </div>
        </div>
        <div className="grid gap-0 divide-y divide-neutral-200">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between py-2.5">
              <div className="h-4 w-20 rounded bg-neutral-100" />
              <div className="h-4 w-24 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="h-10 rounded-full border border-neutral-200 bg-neutral-50 sm:h-11" />
          <div className="h-10 rounded-full bg-neutral-200 sm:h-11" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DonorList({ donors, isLoading, hasSearched, errorMessage }: DonorListProps) {
  const { meQuery } = useAuth();
  const [selectedDonor, setSelectedDonor] = useState<DonorListItem | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  if (!hasSearched) {
    return null;
  }

  const donorCountLabel = isLoading
    ? 'Searching…'
    : `${donors.length} ${donors.length === 1 ? 'donor' : 'donors'}`;

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
            Compare distance and availability, then request blood or open a profile.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm font-medium text-neutral-700">
          <UsersRound className="h-4 w-4 text-neutral-500" aria-hidden />
          {donorCountLabel}
        </span>
      </div>

      {isLoading ? (
        <div
          className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Loading donor results"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <DonorSkeletonCard key={index} />
          ))}
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800">Search unavailable</h3>
          <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
        </div>
      ) : donors.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <h3 className="text-lg font-semibold text-neutral-950">No donors found</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
            Try another blood group, city, or nearby district to widen your search.
          </p>
        </div>
      ) : (
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
