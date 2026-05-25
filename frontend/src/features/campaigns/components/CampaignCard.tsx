import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Droplet,
  MapPin,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCampaignDateRange } from '../lib/campaign-filters';
import { BloodDonationCampaign } from '../types/campaign.types';
import { CampaignStatusBadge } from './CampaignStatusBadge';

type CampaignCardProps = {
  campaign: BloodDonationCampaign;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const spotsLeft = Math.max(campaign.capacity - campaign.registrationCount, 0);

  return (
    <Card className="group overflow-hidden rounded-2xl border-neutral-200 shadow-sm transition hover:border-red-200 hover:shadow-lg hover:shadow-red-950/10">
      <CardContent className="flex h-full flex-col p-0">
        <div className="border-b border-neutral-100 bg-[linear-gradient(135deg,#fef2f2_0%,#fff7ed_100%)] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <CampaignStatusBadge status={campaign.status} />
            <span className="rounded-md bg-red-700 px-2 py-1 text-xs font-bold text-white">
              {campaign.bloodGroupsNeeded.slice(0, 3).join(' · ')}
              {campaign.bloodGroupsNeeded.length > 3 ? ' +' : ''}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-bold leading-snug text-neutral-950 transition group-hover:text-red-800">
            <Link className="outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-red-600" href={`/campaigns/${campaign.slug}`}>
              {campaign.title}
            </Link>
          </h3>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <p className="line-clamp-2 text-sm leading-6 text-neutral-600">
            {campaign.shortDescription}
          </p>

          <ul className="grid gap-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
              <span>
                {campaign.venue}, {campaign.city}, {campaign.state}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
              <span>{formatCampaignDateRange(campaign.startDate, campaign.endDate)}</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
              <span>
                {campaign.registrationCount} registered
                {spotsLeft > 0 ? ` · ${spotsLeft} spots left` : ' · nearly full'}
              </span>
            </li>
          </ul>

          <p className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
            <Droplet className="h-3.5 w-3.5 text-red-600" aria-hidden />
            {campaign.organizer}
          </p>

          <Button
            asChild
            className="h-11 w-full gap-2 rounded-full bg-red-700 px-5 text-sm font-semibold text-white shadow-sm shadow-red-700/20 hover:bg-red-800"
          >
            <Link href={`/campaigns/${campaign.slug}`}>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              View campaign details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
