import { DonorSearchResult } from '@/types/donor';
import { DonorCard } from './DonorCard';

type DonorListProps = {
  donors: DonorSearchResult[];
  isLoading: boolean;
  hasSearched: boolean;
  errorMessage?: string;
};

function DonorSkeletonCard() {
  return (
    <div className="grid gap-5 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-blue-950/5">
      <div className="flex items-start justify-between gap-4">
        <div className="grid flex-1 gap-2">
          <div className="h-5 w-36 rounded-full bg-neutral-200" />
          <div className="h-4 w-44 rounded-full bg-neutral-100" />
        </div>
        <div className="h-7 w-12 rounded-full bg-red-100" />
      </div>
      <div className="flex gap-2">
        <div className="h-7 w-24 rounded-full bg-green-100" />
        <div className="h-7 w-20 rounded-full bg-blue-100" />
      </div>
      <div className="h-11 rounded-full bg-neutral-100" />
    </div>
  );
}

export function DonorList({ donors, isLoading, hasSearched, errorMessage }: DonorListProps) {
  if (!hasSearched) {
    return null;
  }

  const donorCountLabel = isLoading ? 'Searching...' : `${donors.length} donors found`;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-5 text-left">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-700">Search results</p>
          <h2 className="mt-1 text-2xl font-bold text-neutral-950">Available Donors</h2>
        </div>
        <span className="text-sm font-medium text-neutral-500">{donorCountLabel}</span>
      </div>

      {isLoading ? (
        <div className="grid animate-pulse gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading donor results">
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
        <div className="rounded-2xl border border-blue-100 bg-white/85 p-8 text-center shadow-sm shadow-blue-950/5">
          <h3 className="text-lg font-bold text-neutral-950">No donors found</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
            Try another blood group, city, or nearby district to widen your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {donors.map((donor) => (
            <DonorCard donor={donor} key={donor.id} />
          ))}
        </div>
      )}
    </div>
  );
}
