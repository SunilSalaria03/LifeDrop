'use client';

import { useState } from 'react';
import { UsersRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RequestBloodModal } from '@/features/donors/components/RequestBloodModal';
import { DonorListItem } from '@/features/donors/types/donor.types';
import { userStorage } from '@/lib/auth/user-storage';
import { DonorCard } from './DonorCard';
import { DonorListProps } from './landing.types';

function DonorSkeletonCard() {
  return (
    <Card className="overflow-hidden rounded-2xl border-white/80 bg-white/90 shadow-lg shadow-blue-950/5">
      <CardContent className="grid gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-neutral-200" />
            <div className="grid flex-1 gap-2">
              <div className="h-4 w-32 rounded-full bg-neutral-200" />
              <div className="h-3 w-40 max-w-full rounded-full bg-neutral-100" />
            </div>
          </div>
          <div className="h-8 w-14 rounded-full bg-red-100" />
        </div>
        <div className="grid gap-3">
          <div className="h-4 w-full rounded-full bg-neutral-100" />
          <div className="h-4 w-5/6 rounded-full bg-neutral-100" />
          <div className="h-4 w-3/4 rounded-full bg-neutral-100" />
        </div>
        <div className="h-11 rounded-full bg-neutral-100" />
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

  const donorCountLabel = isLoading ? 'Searching...' : `${donors.length} donors found`;

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
    <div className="mx-auto grid w-full max-w-6xl gap-5 text-left">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-red-700">
            Search results
          </p>
          <h2 className="mt-1 text-2xl font-bold text-neutral-950">
            Available Donors
          </h2>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-red-100 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 shadow-sm shadow-red-950/5 ring-1 ring-red-100">
          <UsersRound className="h-4 w-4" />
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
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center shadow-sm">
          <h3 className="text-lg font-bold text-red-800">API failed</h3>
          <p className="mt-2 text-sm font-medium text-red-700">{errorMessage}</p>
        </div>
      ) : donors.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-neutral-950">No donors found</h3>
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
