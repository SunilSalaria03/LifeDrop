'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Droplet,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCampaignDateRange } from '../lib/campaign-filters';
import { BloodDonationCampaign } from '../types/campaign.types';

type CampaignDetailContentProps = {
  campaign: BloodDonationCampaign;
};

type DetailSectionProps = {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
};

function DetailSection({ title, icon: Icon, children, className }: DetailSectionProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm',
        className,
      )}
    >
      <CardContent className="grid gap-5 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 via-white to-orange-50 text-red-700 ring-1 ring-red-100/80">
            <Icon className="h-5 w-5" aria-hidden strokeWidth={2} />
          </span>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">{title}</h2>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function CampaignDetailContent({ campaign }: CampaignDetailContentProps) {
  const spotsLeft = Math.max(campaign.capacity - campaign.registrationCount, 0);

  const quickFacts = [
    {
      label: 'Campaign dates',
      value: formatCampaignDateRange(campaign.startDate, campaign.endDate),
      icon: CalendarClock,
    },
    {
      label: 'Location',
      value: `${campaign.city}, ${campaign.state}`,
      icon: MapPin,
    },
    {
      label: 'Registrations',
      value: `${campaign.registrationCount} of ${campaign.capacity}`,
      icon: Users,
    },
    {
      label: 'Availability',
      value: spotsLeft > 0 ? `${spotsLeft} spots open` : 'At capacity',
      icon: UserPlus,
    },
  ];

  return (
    <div className="bg-neutral-50">
      <div className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <CardContent className="grid gap-0 p-0">
              <div className="grid divide-y divide-neutral-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                {quickFacts.map((fact) => {
                  const Icon = fact.icon;
                  return (
                    <div
                      className="flex gap-3 px-5 py-5 sm:px-6"
                      key={fact.label}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          {fact.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-snug text-neutral-900">
                          {fact.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-8 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="grid gap-6">
          <DetailSection icon={Sparkles} title="About this campaign">
            <p className="text-sm leading-7 text-neutral-700 sm:text-base">
              {campaign.description}
            </p>
          </DetailSection>

          <DetailSection icon={CheckCircle2} title="What to expect">
            <ul className="grid gap-3 sm:grid-cols-2">
              {campaign.highlights.map((item) => (
                <li
                  className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/80 p-4"
                  key={item}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
                    <Droplet className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-sm font-medium leading-6 text-neutral-800">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <div className="grid gap-6 sm:grid-cols-2">
            <DetailSection icon={CalendarClock} title="Schedule">
              <p className="text-sm leading-7 text-neutral-700">
                {campaign.scheduleNotes}
              </p>
            </DetailSection>
            <DetailSection icon={ShieldCheck} title="Eligibility">
              <p className="text-sm leading-7 text-neutral-700">
                {campaign.eligibilityNotes}
              </p>
            </DetailSection>
          </div>
        </div>

        <aside className="grid h-fit gap-6 lg:sticky lg:top-24">
          <DetailSection icon={Building2} title="Venue & location">
            <div className="grid gap-4 text-sm text-neutral-700">
              <p className="flex items-start gap-3 rounded-xl bg-neutral-50/90 p-4">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
                <span>
                  <span className="block font-semibold text-neutral-950">
                    {campaign.venue}
                  </span>
                  <span className="mt-1 block leading-6">{campaign.address}</span>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
                <span className="leading-6">
                  {campaign.district}, {campaign.city}, {campaign.state} —{' '}
                  {campaign.pincode}
                </span>
              </p>
            </div>
          </DetailSection>

          <DetailSection icon={HeartHandshake} title="Organizer">
            <p className="text-base font-semibold text-neutral-900">
              {campaign.organizer}
            </p>
            <div className="grid gap-2 pt-1">
              {campaign.organizerPhone ? (
                <a
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50/90 px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-100 hover:bg-red-50"
                  href={`tel:${campaign.organizerPhone}`}
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  {campaign.organizerPhone}
                </a>
              ) : null}
              {campaign.organizerEmail ? (
                <a
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50/90 px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-100 hover:bg-red-50"
                  href={`mailto:${campaign.organizerEmail}`}
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {campaign.organizerEmail}
                </a>
              ) : null}
            </div>
          </DetailSection>

          <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <CardContent className="grid gap-4 p-6">
              <h2 className="text-lg font-bold text-neutral-950">Plan your visit</h2>
              <p className="text-sm leading-7 text-neutral-700">
                Arrive with a valid photo ID, stay hydrated, and follow on-site medical
                guidance. For urgent blood requirements, search registered donors on
                LifeDrop.
              </p>
              <Button
                asChild
                className="h-11 w-full gap-2 rounded-full bg-red-700 shadow-sm shadow-red-700/20 hover:bg-red-800"
              >
                <Link href="/donor-list">
                  <HeartHandshake className="h-4 w-4" />
                  Find donors near you
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
