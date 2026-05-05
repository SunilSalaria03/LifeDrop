import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DonorSearchResult } from '@/types/donor';

type DonorCardProps = {
  donor: DonorSearchResult;
};

export function DonorCard({ donor }: DonorCardProps) {
  return (
    <Card className="rounded-2xl border-white/70 bg-white/90 shadow-lg shadow-blue-950/5 backdrop-blur">
      <CardContent className="grid gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-neutral-950">
              {donor.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
              <MapPin className="h-4 w-4 text-blue-600" />
              {donor.city}, {donor.state}
            </p>
          </div>
          <Badge className="bg-red-50 text-red-700 ring-1 ring-red-100">
            {donor.bloodGroup}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge
            className={
              donor.isAvailable
                ? 'bg-green-50 text-green-700 ring-1 ring-green-100'
                : 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200'
            }
          >
            {donor.isAvailable ? 'Available' : 'Not Available'}
          </Badge>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            {donor.distanceKm !== undefined
              ? `${donor.distanceKm} km away`
              : (donor.district ?? donor.city)}
          </span>
        </div>

        <Button
          className="h-11 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          type="button"
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
