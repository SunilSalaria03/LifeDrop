'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  HeartPulse,
  MapPin,
  Navigation,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useDonorDetails } from '@/features/donors/hooks/useDonorDetails';
import { DonorDetail } from '@/features/donors/types/donor.types';

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

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm shadow-neutral-950/5">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-normal text-neutral-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-neutral-950">
          {value}
        </p>
      </div>
    </div>
  );
}

function DonorProfileHeader({ donor }: { donor: DonorDetail }) {
  const donorName = getDonorName(donor.name);
  const location = [donor.city, donor.district, donor.state]
    .filter(Boolean)
    .join(', ');

  return (
    <Card className="overflow-hidden rounded-2xl border-white/80 bg-white shadow-xl shadow-blue-950/10">
      <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center lg:p-8">
        <Avatar className="h-24 w-24 border-4 border-blue-50 bg-blue-50">
          {donor.profileImage ? (
            <AvatarImage alt={donorName} src={donor.profileImage} />
          ) : null}
          <AvatarFallback className="text-2xl text-blue-700">
            {getInitials(donor.name)}
          </AvatarFallback>
        </Avatar>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-normal text-neutral-950 sm:text-4xl">
                {donorName}
              </h1>
              {donor.isVerified ? (
                <ShieldCheck
                  aria-label="Verified donor"
                  className="h-6 w-6 text-blue-600"
                />
              ) : null}
            </div>
            <p className="flex items-center gap-2 text-base text-neutral-600">
              <MapPin className="h-5 w-5 shrink-0 text-blue-600" />
              <span>{location}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-red-50 px-4 py-2 text-base text-red-700 ring-1 ring-red-100">
              {donor.bloodGroup}
            </Badge>
            <Badge
              className={
                donor.isAvailable
                  ? 'gap-1.5 bg-green-50 px-4 py-2 text-green-700 ring-1 ring-green-100'
                  : 'gap-1.5 bg-neutral-100 px-4 py-2 text-neutral-600 ring-1 ring-neutral-200'
              }
            >
              <CheckCircle2 className="h-4 w-4" />
              {donor.isAvailable ? 'Available' : 'Not Available'}
            </Badge>
            {donor.isVerified ? (
              <Badge className="gap-1.5 bg-blue-50 px-4 py-2 text-blue-700 ring-1 ring-blue-100">
                <ShieldCheck className="h-4 w-4" />
                Verified
              </Badge>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DonorDetailPage() {
  const params = useParams<{ id: string }>();
  const donorId = params.id;
  const donorQuery = useDonorDetails(donorId);
  const donor = donorQuery.data;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[linear-gradient(135deg,#f4f8ff_0%,#ffffff_48%,#fff5f3_100%)] px-4 py-10 text-neutral-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6">
          <Button asChild className="w-fit rounded-full" variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
          </Button>

          {donorQuery.isLoading ? (
            <Card className="animate-pulse rounded-2xl border-white/80 bg-white/90 shadow-xl shadow-blue-950/10">
              <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] lg:p-8">
                <div className="h-24 w-24 rounded-full bg-neutral-200" />
                <div className="grid gap-3">
                  <div className="h-8 w-64 rounded-full bg-neutral-200" />
                  <div className="h-5 w-80 max-w-full rounded-full bg-neutral-100" />
                  <div className="flex gap-2">
                    <div className="h-9 w-16 rounded-full bg-red-100" />
                    <div className="h-9 w-28 rounded-full bg-green-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : donorQuery.error ? (
            <Card className="rounded-2xl border-red-100 bg-red-50 shadow-sm">
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-800">
                  Donor profile unavailable
                </h1>
                <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-red-700">
                  {donorQuery.error.message}
                </p>
              </CardContent>
            </Card>
          ) : donor ? (
            <>
              <DonorProfileHeader donor={donor} />

              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <Card className="rounded-2xl border-white/80 bg-white/95 shadow-lg shadow-blue-950/5">
                  <CardHeader>
                    <h2 className="text-xl font-bold text-neutral-950">
                      Donor Details
                    </h2>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    <DetailItem
                      icon={HeartPulse}
                      label="Blood group"
                      value={donor.bloodGroup}
                    />
                    <DetailItem
                      icon={MapPin}
                      label="Location"
                      value={[donor.city, donor.state].filter(Boolean).join(', ')}
                    />
                    <DetailItem icon={MapPin} label="City" value={donor.city} />
                    <DetailItem icon={MapPin} label="State" value={donor.state} />
                    <DetailItem
                      icon={MapPin}
                      label="District"
                      value={donor.district ?? 'Not provided'}
                    />
                    {donor.distanceKm !== undefined ? (
                      <DetailItem
                        icon={Navigation}
                        label="Distance"
                        value={`${donor.distanceKm} km away`}
                      />
                    ) : null}
                    <DetailItem
                      icon={CalendarCheck}
                      label="Last donation"
                      value={formatDate(donor.lastDonationDate)}
                    />
                    <DetailItem
                      icon={CalendarClock}
                      label="Next eligible"
                      value={formatDate(donor.nextEligibleDate)}
                    />
                    <DetailItem
                      icon={HeartPulse}
                      label="Total donations"
                      value={`${donor.totalDonations ?? 0}`}
                    />
                    <DetailItem
                      icon={Users}
                      label="Member since"
                      value={formatDate(donor.createdAt)}
                    />
                  </CardContent>
                </Card>

                <Card className="h-fit rounded-2xl border-white/80 bg-white/95 shadow-lg shadow-blue-950/5">
                  <CardHeader>
                    <h2 className="text-xl font-bold text-neutral-950">
                      Request Support
                    </h2>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <p className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium leading-6 text-blue-800">
                      Contact details are shared only after request approval.
                    </p>
                    <Button
                      asChild
                      className="h-12 rounded-full bg-red-600 text-white hover:bg-red-700"
                    >
                      <Link href={`/request-blood?donorId=${donor.id}`}>
                        Request Blood
                      </Link>
                    </Button>
                    <Button asChild className="h-12 rounded-full" variant="outline">
                      <Link href="/">Back to Search</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
