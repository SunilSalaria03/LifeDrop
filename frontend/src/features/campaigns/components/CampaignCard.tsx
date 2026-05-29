import Link from 'next/link';
import { ComponentType } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Droplet,
  Loader2,
  MapPin,
  PencilLine,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCampaignDateRange } from '../lib/campaign-filters';
import { BloodDonationCampaign } from '../types/campaign.types';
import { CampaignStatusBadge } from './CampaignStatusBadge';

type CampaignCardProps = {
  campaign: BloodDonationCampaign;
  showOwnerActions?: boolean;
  isDeleting?: boolean;
  onDelete?: (campaign: BloodDonationCampaign) => void;
  onEdit?: (campaign: BloodDonationCampaign) => void;
};

type CampaignDetailItemProps = {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  label: string;
  value: string;
};

function CampaignDetailItem({
  icon: Icon,
  label,
  value,
}: CampaignDetailItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <dt className="flex items-center gap-1.5 text-neutral-500">
        <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
        <span>{label}</span>
      </dt>
      <dd className="max-w-[65%] truncate text-right font-medium text-neutral-900">
        {value}
      </dd>
    </div>
  );
}

export function CampaignCard({
  campaign,
  showOwnerActions = false,
  isDeleting = false,
  onDelete,
  onEdit,
}: CampaignCardProps) {
  const registrationCount = campaign.registrationCount ?? 0;
  const capacity = campaign.capacity ?? 0;
  const spotsLeft = Math.max(capacity - registrationCount, 0);
  const bloodGroupsLabel = campaign.bloodGroupsNeeded.slice(0, 3).join(' · ');

  return (
    <Card className="overflow-hidden rounded-2xl border-neutral-200 transition hover:border-neutral-300">
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="relative overflow-hidden rounded-xl border border-red-100/70 bg-white p-4">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_18%_0%,rgba(220,38,38,0.14),transparent_42%),linear-gradient(135deg,rgba(254,226,226,0.9),rgba(255,255,255,0.22))]" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CampaignStatusBadge status={campaign.status} />
                {campaign.isVerified ? (
                  <Badge className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    <ShieldCheck className="h-3.5 w-3.5 text-red-600" />
                    Verified
                  </Badge>
                ) : null}
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-neutral-950">
                <Link
                  className="outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-red-600"
                  href={`/campaigns/${campaign.slug}`}
                >
                  {campaign.title}
                </Link>
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-600">
                {campaign.shortDescription}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-red-700 px-2.5 py-1 text-sm font-semibold text-white">
              {bloodGroupsLabel}
              {campaign.bloodGroupsNeeded.length > 3 ? ' +' : ''}
            </span>
          </div>
        </div>

        <dl className="divide-y divide-neutral-200 pb-1 pt-4">
          <CampaignDetailItem
            icon={MapPin}
            label="Venue"
            value={`${campaign.venue}, ${campaign.city}`}
          />
          <CampaignDetailItem
            icon={CalendarDays}
            label="Schedule"
            value={formatCampaignDateRange(campaign.startDate, campaign.endDate)}
          />
          <CampaignDetailItem
            icon={Users}
            label="Registrations"
            value={`${registrationCount} registered${spotsLeft > 0 ? ` · ${spotsLeft} spots left` : ' · nearly full'}`}
          />
          <CampaignDetailItem
            icon={UserRound}
            label="Organizer"
            value={campaign.organizer}
          />
          <CampaignDetailItem
            icon={Droplet}
            label="Groups needed"
            value={`${campaign.bloodGroupsNeeded.length} blood groups`}
          />
        </dl>

        <div className="mt-auto pt-5">
          <Button
            asChild
            className="h-11 w-full gap-2 rounded-full bg-red-700 px-5 text-sm font-semibold text-white shadow-sm shadow-red-700/20 hover:bg-red-800"
          >
            <Link href={`/campaigns/${campaign.slug}`}>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              View campaign details
            </Link>
          </Button>
          {showOwnerActions ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                className="h-10 gap-2 border-neutral-200"
                onClick={() => onEdit?.(campaign)}
                type="button"
                variant="outline"
              >
                <PencilLine className="h-4 w-4" />
                Edit
              </Button>
              <Button
                className="h-10 gap-2 bg-red-700 text-white hover:bg-red-800"
                disabled={isDeleting}
                onClick={() => onDelete?.(campaign)}
                type="button"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
