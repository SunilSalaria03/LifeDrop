import Link from 'next/link';
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  HeartPulse,
  MapPin,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DonorListItem } from '@/features/donors/types/donor.types';

type DonorCardProps = {
  donor: DonorListItem;
};

function getDonorName(name?: string) {
  return name?.trim() || 'LifeDrop Donor';
}

function getInitials(name?: string) {
  return getDonorName(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function formatDate(date?: string) {
  if (!date) {
    return 'Not provided';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-3 py-2.5 shadow-sm shadow-blue-950/5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-normal text-neutral-500">
          {label}
        </span>
        <span className="block truncate text-sm font-semibold text-neutral-900">
          {value}
        </span>
      </span>
    </div>
  );
}

export function DonorCard({ donor }: DonorCardProps) {
  const donorName = getDonorName(donor.name);
  const location = [donor.city, donor.district, donor.state]
    .filter(Boolean)
    .join(', ');

  return (
    <Card className="group overflow-hidden rounded-2xl border-white/80 bg-white shadow-xl shadow-blue-950/10 transition duration-200 hover:-translate-y-1 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-950/15">
      <CardContent className="grid gap-0 p-0">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_48%,#fff1f2_100%)] p-5">
          <div className="absolute right-[-42px] top-[-52px] h-32 w-32 rounded-full bg-red-100/70" />
          <div className="absolute bottom-[-64px] left-[-52px] h-36 w-36 rounded-full bg-blue-100/70" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white bg-blue-50 shadow-lg shadow-blue-950/10">
                {donor.profileImage ? (
                  <AvatarImage alt={donorName} src={donor.profileImage} />
                ) : null}
                <AvatarFallback className="bg-blue-50 text-lg text-blue-700">
                  {getInitials(donor.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h3 className="truncate text-xl font-bold text-neutral-950">
                    {donorName}
                  </h3>
                  {donor.isVerified ? (
                    <ShieldCheck
                      aria-label="Verified donor"
                      className="h-5 w-5 shrink-0 text-blue-600"
                    />
                  ) : null}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                  <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
                  <span className="truncate">{location || 'Location not provided'}</span>
                </p>
              </div>
            </div>

            <Badge className="shrink-0 rounded-2xl bg-red-600 px-4 py-2 text-lg font-bold text-white shadow-lg shadow-red-500/20 ring-1 ring-red-500/20">
              {donor.bloodGroup}
            </Badge>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                donor.isAvailable
                  ? 'gap-1.5 bg-green-50 px-3.5 py-1.5 text-green-700 ring-1 ring-green-100'
                  : 'gap-1.5 bg-neutral-100 px-3.5 py-1.5 text-neutral-600 ring-1 ring-neutral-200'
              }
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {donor.isAvailable ? 'Available now' : 'Not available'}
            </Badge>
            {donor.isVerified ? (
              <Badge className="gap-1.5 bg-blue-50 px-3.5 py-1.5 text-blue-700 ring-1 ring-blue-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified donor
              </Badge>
            ) : null}
          </div>

          <div className="grid gap-2.5 rounded-2xl border border-blue-50 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_100%)] p-3.5">
            {donor.distanceKm !== undefined ? (
              <DetailRow
                icon={Navigation}
                label="Distance"
                value={`${donor.distanceKm} km away`}
              />
            ) : null}
            <DetailRow
              icon={CalendarCheck}
              label="Last donation"
              value={formatDate(donor.lastDonationDate)}
            />
            {donor.nextEligibleDate ? (
              <DetailRow
                icon={CalendarClock}
                label="Next eligible"
                value={formatDate(donor.nextEligibleDate)}
              />
            ) : null}
            {donor.totalDonations !== undefined ? (
              <DetailRow
                icon={HeartPulse}
                label="Total donations"
                value={`${donor.totalDonations}`}
              />
            ) : null}
            {donor.totalDonations === undefined ? (
              <DetailRow
                icon={HeartPulse}
                label="Total donations"
                value="Not provided"
              />
            ) : null}
          </div>

          <Button
            asChild
            className="h-12 rounded-full bg-blue-700 text-base font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 group-hover:shadow-blue-700/30"
          >
            <Link
              aria-label={`View ${donorName} donor profile`}
              href={`/donors/${donor.id}`}
            >
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
