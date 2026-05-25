'use client';

import { UserSearch, UsersRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DonorListMode } from './landing.types';

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

type DonorSearchResultsSkeletonShellProps = {
  mode?: DonorListMode;
  pageSize?: number;
};

export function DonorSearchResultsSkeletonShell({
  mode = 'paginated',
  pageSize,
}: DonorSearchResultsSkeletonShellProps) {
  const skeletonCount = pageSize ?? (mode === 'preview' ? 6 : 12);

  return (
    <section
      aria-busy="true"
      aria-label="Loading donor results"
      className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
      id="donor-search-results"
      role="status"
    >
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
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm font-medium text-neutral-700">
            <UsersRound className="h-4 w-4 text-neutral-500" aria-hidden />
            Searching…
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <DonorSkeletonCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
