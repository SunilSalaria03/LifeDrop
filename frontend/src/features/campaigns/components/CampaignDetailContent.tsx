'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Droplet,
  ExternalLink,
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
import {
  formatCampaignDateRange,
  formatCampaignDateTimeRange,
} from '../lib/campaign-filters';
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
        'overflow-hidden rounded-2xl border border-neutral-200 bg-white',
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <p className="text-sm leading-7 text-neutral-700">
      <span className="font-semibold text-neutral-900">{label}: </span>
      {value}
    </p>
  );
}

export function CampaignDetailContent({ campaign }: CampaignDetailContentProps) {
  const capacity = campaign.capacity;
  const registrationCount = campaign.registrationCount ?? 0;
  const hasCapacity = campaign.hasCapacity ?? typeof capacity === 'number';
  const safeCapacity = typeof capacity === 'number' ? capacity : 0;
  const spotsLeft = hasCapacity ? Math.max(safeCapacity - registrationCount, 0) : null;
  const aboutText = campaign.description || campaign.shortDescription || 'Not available';
  const expectItems = campaign.highlights.filter((item) => item.trim() !== '');
  const instructionText = campaign.instructions?.trim() ?? '';
  const eligibilityText = campaign.eligibilityNotes?.trim() ?? '';
  const scheduleText = campaign.scheduleNotes?.trim() ?? '';

  const toDisplayDateTime = (value?: string) => {
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const quickFacts = [
    {
      label: 'Campaign dates',
      value: formatCampaignDateTimeRange(
        campaign.startDate,
        campaign.endDate,
        campaign.startTime,
        campaign.endTime,
      ),
      icon: CalendarClock,
    },
    {
      label: 'Location',
      value:
        `${campaign.venue}, ${campaign.city}, ${campaign.state}`.replace(/^,\s*/, '') ||
        campaign.address ||
        'Not available',
      icon: MapPin,
    },
    {
      label: 'Registrations',
      value: hasCapacity
        ? `${registrationCount} of ${safeCapacity}`
        : `${registrationCount}`,
      icon: Users,
    },
    {
      label: 'Availability',
      value: hasCapacity
        ? spotsLeft && spotsLeft > 0
          ? `${spotsLeft} spots open`
          : 'At capacity'
        : 'Open for registration',
      icon: UserPlus,
    },
  ];

  return (
    <div className="bg-neutral-50">
      <div className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
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
              {aboutText}
            </p>
          </DetailSection>

          <DetailSection icon={CheckCircle2} title="What to expect">
            {expectItems.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {expectItems.map((item) => (
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
            ) : instructionText ? (
              <p className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-4 text-sm leading-7 text-neutral-700">
                {instructionText}
              </p>
            ) : (
              <p className="text-sm leading-7 text-neutral-700">
                Detailed expectations are not available for this campaign yet.
              </p>
            )}
          </DetailSection>

          <div className="grid gap-6 sm:grid-cols-2">
            <DetailSection icon={CalendarClock} title="Schedule">
              <div className="grid gap-2 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4">
                <DetailRow
                  label="Dates"
                  value={formatCampaignDateRange(campaign.startDate, campaign.endDate)}
                />
                {campaign.startTime || campaign.endTime ? (
                  <DetailRow
                    label="Time"
                    value={
                      <>
                        {campaign.startTime || 'N/A'}{' '}
                        {campaign.endTime ? `– ${campaign.endTime}` : ''}
                      </>
                    }
                  />
                ) : null}
                {campaign.registrationDeadline ? (
                  <DetailRow
                    label="Registration deadline"
                    value={
                      toDisplayDateTime(campaign.registrationDeadline) ?? 'Not available'
                    }
                  />
                ) : null}
                <DetailRow
                  label="Registration"
                  value={campaign.registrationRequired ? 'Required' : 'Not required'}
                />
                <DetailRow
                  label="Walk-ins"
                  value={campaign.allowWalkIn ? 'Allowed' : 'Not allowed'}
                />
                {scheduleText ? <p className="pt-1 text-sm leading-7 text-neutral-700">{scheduleText}</p> : null}
              </div>
            </DetailSection>
            <DetailSection icon={ShieldCheck} title="Eligibility">
              <div className="grid gap-2 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 text-sm leading-7 text-neutral-700">
                <p>{eligibilityText || 'Eligibility details are not available yet.'}</p>
                {campaign.bloodGroupsNeeded.length > 0 ? (
                  <DetailRow
                    label="Blood groups"
                    value={campaign.bloodGroupsNeeded.join(', ')}
                  />
                ) : null}
                {campaign.donationTypes && campaign.donationTypes.length > 0 ? (
                  <DetailRow
                    label="Donation types"
                    value={campaign.donationTypes
                      .map((type) => type.replace(/_/g, ' '))
                      .join(', ')}
                  />
                ) : null}
              </div>
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
                  {campaign.address ? (
                    <span className="mt-1 block leading-6">{campaign.address}</span>
                  ) : null}
                  {campaign.landmark ? (
                    <span className="mt-1 block leading-6 text-neutral-600">
                      Landmark: {campaign.landmark}
                    </span>
                  ) : null}
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
            {campaign.organizerType ? (
              <p className="text-sm text-neutral-600 capitalize">
                {campaign.organizerType.replace(/_/g, ' ')}
              </p>
            ) : null}
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
              {campaign.organizerWebsite ? (
                <a
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50/90 px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-100 hover:bg-red-50"
                  href={campaign.organizerWebsite}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  {campaign.organizerWebsite}
                </a>
              ) : null}
            </div>
          </DetailSection>

          <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <CardContent className="grid gap-4 p-6">
              <h2 className="text-lg font-bold text-neutral-950">Plan your visit</h2>
              {campaign.instructions ? (
                <p className="text-sm leading-7 text-neutral-700">{campaign.instructions}</p>
              ) : (
                <p className="text-sm leading-7 text-neutral-700">
                  Arrive with a valid photo ID and follow on-site medical guidance.
                </p>
              )}
              {(campaign.contactPerson?.name ||
                campaign.contactPerson?.phone ||
                campaign.contactPerson?.email) ? (
                <div className="grid gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm">
                  {campaign.contactPerson?.name ? (
                    <p className="font-semibold text-neutral-900">
                      {campaign.contactPerson.name}
                    </p>
                  ) : null}
                  {campaign.contactPerson?.phone ? (
                    <a
                      className="inline-flex items-center gap-2 text-red-700"
                      href={`tel:${campaign.contactPerson.phone}`}
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden />
                      {campaign.contactPerson.phone}
                    </a>
                  ) : null}
                  {campaign.contactPerson?.email ? (
                    <a
                      className="inline-flex items-center gap-2 text-red-700"
                      href={`mailto:${campaign.contactPerson.email}`}
                    >
                      <Mail className="h-4 w-4 shrink-0" aria-hidden />
                      {campaign.contactPerson.email}
                    </a>
                  ) : null}
                </div>
              ) : null}
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
