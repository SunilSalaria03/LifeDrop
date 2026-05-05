'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

type LocationStatus = 'detecting' | 'detected' | 'manual';

type DetectedLocation = {
  lat: number | null;
  lng: number | null;
};

export function LocationSelector() {
  const [status, setStatus] = useState<LocationStatus>('detecting');
  const [location, setLocation] = useState<DetectedLocation | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setStatus('manual');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus('detected');
      },
      () => {
        setStatus('manual');
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 8000,
      },
    );
  }, []);

  const label =
    status === 'detected' && location
      ? 'Location detected'
      : status === 'detecting'
        ? 'Detecting location'
        : 'Select location manually';

  return (
    <div className="flex max-w-[150px] items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm shadow-blue-950/5 backdrop-blur sm:max-w-[220px]">
      <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
      <span className="truncate">{label}</span>
    </div>
  );
}
