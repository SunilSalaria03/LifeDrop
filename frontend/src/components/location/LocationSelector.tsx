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
    <div className="flex max-w-[190px] items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm shadow-blue-950/5 backdrop-blur sm:max-w-[260px]">
      <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
      <span className="truncate">{label}</span>
    </div>
  );
}
