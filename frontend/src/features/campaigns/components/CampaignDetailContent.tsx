'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Droplet,
  Loader2,
  ExternalLink,
  HeartHandshake,
  Mail,
  Megaphone,
  MapPin,
  PencilLine,
  Phone,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  profileCard,
  profileCardBody,
  profileCardHeader,
  profileFieldCard,
  profileInsetPanel,
} from '@/app/profile/profile-card.styles';
import { cn } from '@/lib/utils';
import { deleteCampaign, getMyCampaignById } from '../api/campaigns.api';
import { formatCampaignDateRange } from '../lib/campaign-filters';
import { BloodDonationCampaign } from '../types/campaign.types';
import { CampaignStatusBadge } from './CampaignStatusBadge';

type CampaignDetailContentProps = {
  campaign: BloodDonationCampaign;
};

type CampaignInfoFieldProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
};

function CampaignInfoField({
  icon: Icon,
  label,
  value,
  className,
}: CampaignInfoFieldProps) {
  return (
    <div className={cn(profileFieldCard, className)}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-700">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {label}
          </span>
          <span className="mt-1 block break-words text-sm font-semibold text-neutral-900">
            {value}
          </span>
        </span>
      </div>
    </div>
  );
}

export function CampaignDetailContent({ campaign }: CampaignDetailContentProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
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
  const locationLabel = [campaign.city, campaign.district, campaign.state]
    .filter(Boolean)
    .join(', ');

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
  const ownerAccessQuery = useQuery({
    enabled: Boolean(user && campaign.id),
    queryKey: ['campaign-owner-access', campaign.id],
    queryFn: () => getMyCampaignById(campaign.id),
    retry: false,
  });
  const isOwner = ownerAccessQuery.isSuccess;
  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      showToast({
        title: 'Campaign deleted',
        message: 'Your campaign has been removed.',
        variant: 'success',
      });
      router.push('/campaigns/my');
    },
    onError: (error: Error) => {
      showToast({
        title: 'Delete failed',
        message: error.message,
        variant: 'error',
      });
    },
  });

  function handleEditCampaign() {
    showToast({
      title: 'Opening editor',
      message: `Editing "${campaign.title}".`,
      variant: 'success',
    });
    router.push(`/campaigns/my/${campaign.id}/edit`);
  }

  async function handleDeleteCampaign() {
    showToast({
      title: 'Delete confirmation',
      message: `Please confirm delete for "${campaign.title}".`,
      variant: 'success',
    });
    const shouldDelete = window.confirm(
      `Delete "${campaign.title}"? This action cannot be undone.`,
    );
    if (!shouldDelete) {
      showToast({
        title: 'Delete cancelled',
        message: 'Campaign was not deleted.',
        variant: 'success',
      });
      return;
    }
    showToast({
      title: 'Deleting campaign',
      message: `"${campaign.title}" is being deleted.`,
      variant: 'success',
    });
    await deleteMutation.mutateAsync(campaign.id);
  }

  return (
    <div className="bg-neutral-50">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
        <Card className={profileCard}>
          <CardContent className={profileCardBody}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-red-50 text-red-700 sm:h-24 sm:w-24">
                <Megaphone className="h-10 w-10" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                        {campaign.title}
                      </h1>
                      {campaign.isVerified ? (
                        <ShieldCheck
                          aria-label="Verified campaign"
                          className="h-5 w-5 shrink-0 text-red-700"
                        />
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-neutral-600 sm:text-base">
                      Donation campaign
                      <span className="text-neutral-300"> · </span>
                      <span className="font-medium text-red-700">LifeDrop</span>
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-600">
                      <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
                      {[campaign.venue, locationLabel].filter(Boolean).join(', ')}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {isOwner ? (
                      <>
                        <Button
                          className="h-10 gap-2 px-4"
                          onClick={handleEditCampaign}
                          type="button"
                          variant="outline"
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit campaign
                        </Button>
                        <Button
                          className="h-10 gap-2 bg-red-700 px-4 text-white hover:bg-red-800"
                          disabled={deleteMutation.isPending}
                          onClick={handleDeleteCampaign}
                          type="button"
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          {deleteMutation.isPending ? 'Deleting...' : 'Delete campaign'}
                        </Button>
                      </>
                    ) : null}
                    <Button asChild className="h-10 px-4">
                      <Link href="/donor-list">
                        <HeartHandshake className="h-4 w-4" />
                        Find donors
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <CampaignStatusBadge status={campaign.status} />
                  {campaign.isVerified ? (
                    <Badge className="gap-1 rounded-md border border-green-200 bg-green-50 font-medium text-green-800">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified campaign
                    </Badge>
                  ) : null}
                  {campaign.isFeatured ? (
                    <Badge className="rounded-md border border-amber-200 bg-amber-50 font-medium text-amber-800">
                      Featured
                    </Badge>
                  ) : null}
                  {campaign.bloodGroupsNeeded.length > 0 ? (
                    <Badge className="rounded-md border border-red-200 bg-red-50 font-medium text-red-800">
                      {campaign.bloodGroupsNeeded.slice(0, 4).join(' · ')}
                      {campaign.bloodGroupsNeeded.length > 4 ? ' +' : ''}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-6">
            <Card className={profileCard}>
              <CardHeader className={profileCardHeader}>
                <h2 className="text-lg font-bold text-neutral-950">About this campaign</h2>
                <p className="text-sm text-neutral-600">
                  Review schedule, registration details, and participation guidance before attending.
                </p>
              </CardHeader>
              <CardContent className={cn(profileCardBody, 'grid gap-3 sm:grid-cols-2')}>
                <div className="sm:col-span-2">
                  <p className={cn(profileInsetPanel, 'text-sm leading-6 text-neutral-700')}>
                    {aboutText}
                  </p>
                </div>

                <CampaignInfoField
                  icon={CalendarClock}
                  label="Campaign dates"
                  value={formatCampaignDateRange(campaign.startDate, campaign.endDate)}
                />
                <CampaignInfoField
                  icon={Clock3}
                  label="Campaign time"
                  value={
                    campaign.startTime || campaign.endTime
                      ? `${campaign.startTime || 'N/A'}${campaign.endTime ? ` - ${campaign.endTime}` : ''}`
                      : 'Not available'
                  }
                />
                <CampaignInfoField
                  icon={Users}
                  label="Registrations"
                  value={
                    hasCapacity
                      ? `${registrationCount} of ${safeCapacity}`
                      : `${registrationCount}`
                  }
                />
                <CampaignInfoField
                  icon={UserPlus}
                  label="Availability"
                  value={
                    hasCapacity
                      ? spotsLeft && spotsLeft > 0
                        ? `${spotsLeft} spots open`
                        : 'At capacity'
                      : 'Open for registration'
                  }
                />
                <CampaignInfoField
                  icon={CalendarClock}
                  label="Registration deadline"
                  value={toDisplayDateTime(campaign.registrationDeadline) ?? 'Not available'}
                />
                <CampaignInfoField
                  icon={CheckCircle2}
                  label="Registration type"
                  value={campaign.registrationRequired ? 'Required' : 'Not required'}
                />
                <CampaignInfoField
                  icon={CheckCircle2}
                  label="Walk-ins"
                  value={campaign.allowWalkIn ? 'Allowed' : 'Not allowed'}
                />
                <CampaignInfoField
                  icon={Droplet}
                  label="Blood groups"
                  value={
                    campaign.bloodGroupsNeeded.length > 0
                      ? campaign.bloodGroupsNeeded.join(', ')
                      : 'Not specified'
                  }
                />
                <CampaignInfoField
                  className="sm:col-span-2"
                  icon={Droplet}
                  label="Donation types"
                  value={
                    campaign.donationTypes && campaign.donationTypes.length > 0
                      ? campaign.donationTypes
                          .map((type) => type.replace(/_/g, ' '))
                          .join(', ')
                      : 'Not specified'
                  }
                />
              </CardContent>
            </Card>

            <Card className={profileCard}>
              <CardHeader className={profileCardHeader}>
                <h2 className="text-lg font-bold text-neutral-950">What to expect</h2>
                <p className="text-sm text-neutral-600">
                  Check preparation notes and on-site expectations before your visit.
                </p>
              </CardHeader>
              <CardContent className={cn(profileCardBody, 'grid gap-3')}>
                {expectItems.length > 0 ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {expectItems.map((item) => (
                      <li
                        className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4"
                        key={item}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-700">
                          <Droplet className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="text-sm font-medium leading-6 text-neutral-800">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={cn(profileInsetPanel, 'text-sm leading-6 text-neutral-700')}>
                    {instructionText || 'Detailed expectations are not available for this campaign yet.'}
                  </p>
                )}
                {scheduleText ? (
                  <p className={cn(profileInsetPanel, 'text-sm leading-6 text-neutral-700')}>
                    {scheduleText}
                  </p>
                ) : null}
                {eligibilityText ? (
                  <p className={cn(profileInsetPanel, 'text-sm leading-6 text-neutral-700')}>
                    {eligibilityText}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <aside className="grid h-fit gap-6">
            <Card className={cn(profileCard, 'h-fit')}>
              <CardHeader className={profileCardHeader}>
                <h2 className="text-lg font-bold text-neutral-950">Venue & organizer</h2>
                <p className="text-sm text-neutral-600">
                  Use this information to plan your visit and contact the campaign team.
                </p>
              </CardHeader>
              <CardContent className={cn(profileCardBody, 'grid gap-4 pt-0')}>
                <CampaignInfoField
                  className="border-neutral-200 bg-neutral-50/60"
                  icon={Building2}
                  label="Venue"
                  value={campaign.venue}
                />
                <CampaignInfoField
                  className="border-neutral-200 bg-neutral-50/60"
                  icon={MapPin}
                  label="Address"
                  value={
                    [campaign.address, campaign.landmark].filter(Boolean).join(', ') ||
                    'Not available'
                  }
                />
                <CampaignInfoField
                  className="border-neutral-200 bg-neutral-50/60"
                  icon={MapPin}
                  label="Location"
                  value={`${campaign.district}, ${campaign.city}, ${campaign.state} - ${campaign.pincode}`}
                />
                <CampaignInfoField
                  className="border-neutral-200 bg-neutral-50/60"
                  icon={HeartHandshake}
                  label="Organizer"
                  value={campaign.organizer}
                />
                {campaign.organizerType ? (
                  <p className={cn(profileInsetPanel, 'text-sm capitalize text-neutral-700')}>
                    Organizer type: {campaign.organizerType.replace(/_/g, ' ')}
                  </p>
                ) : null}

                <div className="grid gap-2">
                  {campaign.organizerPhone ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-200 hover:bg-red-50"
                      href={`tel:${campaign.organizerPhone}`}
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden />
                      {campaign.organizerPhone}
                    </a>
                  ) : null}
                  {campaign.organizerEmail ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-200 hover:bg-red-50"
                      href={`mailto:${campaign.organizerEmail}`}
                    >
                      <Mail className="h-4 w-4 shrink-0" aria-hidden />
                      {campaign.organizerEmail}
                    </a>
                  ) : null}
                  {campaign.organizerWebsite ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-200 hover:bg-red-50"
                      href={campaign.organizerWebsite}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                      {campaign.organizerWebsite}
                    </a>
                  ) : null}
                </div>

                {(campaign.contactPerson?.name ||
                  campaign.contactPerson?.phone ||
                  campaign.contactPerson?.email) ? (
                  <div className={cn(profileInsetPanel, 'grid gap-2 text-sm')}>
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
                <Button
                  asChild
                  className="h-11 w-full gap-2 rounded-full border-neutral-200"
                  variant="outline"
                >
                  <Link href="/campaigns">
                    <ArrowLeft className="h-4 w-4" />
                    Back to campaigns
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
