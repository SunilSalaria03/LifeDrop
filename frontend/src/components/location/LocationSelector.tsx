'use client';

import { MapPin } from 'lucide-react';
import { useSelectedLocation } from '@/features/location/hooks/useLocation';

export function LocationSelector() {
  const { location, isDetecting, error } = useSelectedLocation();

  const label = location
    ? `${location.city}, ${location.state}`
    : isDetecting
      ? 'Detecting location...'
      : error || 'Unable to detect location';

  return (
    <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-red-100 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm shadow-red-950/5 backdrop-blur sm:max-w-[260px] sm:flex-none">
      <MapPin className="h-4 w-4 shrink-0 text-red-600" />
      <span className="truncate">{label}</span>
    </div>
  );
}
