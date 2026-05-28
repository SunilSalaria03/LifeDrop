'use client';

import { MapPin, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { titleClassNameCompact } from '@/components/landing/HeroBannerHeading';
import { HeroBannerShell } from '@/components/landing/HeroBannerShell';
import { BloodDonationCampaign } from '../types/campaign.types';
import { CampaignStatusBadge } from './CampaignStatusBadge';

type CampaignDetailHeroProps = {
  campaign: BloodDonationCampaign;
};

function splitCampaignTitle(title: string) {
  const separator = ' — ';
  const index = title.indexOf(separator);

  if (index === -1) {
    return { main: title, highlight: '' };
  }

  return {
    main: title.slice(0, index),
    highlight: title.slice(index + separator.length),
  };
}

export function CampaignDetailHero({ campaign }: CampaignDetailHeroProps) {
  const locationLabel = [campaign.city, campaign.state].filter(Boolean).join(', ');
  const { main: titleMain, highlight: titleHighlight } = splitCampaignTitle(
    campaign.title,
  );
  const campaignTypeLabel = campaign.type
    ? campaign.type.replace(/_/g, ' ')
    : 'campaign';

  return (
    <HeroBannerShell
      contentClassName="flex-col justify-center py-8 sm:py-10 lg:py-12"
      imageUrl={campaign.images?.bannerUrl || campaign.images?.thumbnailUrl}
      size="compact"
    >
      <div className="grid w-full max-w-3xl gap-3 sm:gap-4 lg:max-w-[58%]">
        <div className="flex flex-wrap items-center gap-2">
          <p
            aria-label="Campaign detail page"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 px-3 py-1.5 text-xs font-semibold leading-snug tracking-[0.08em] text-red-300 backdrop-blur-sm"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
              <Megaphone className="h-3.5 w-3.5" aria-hidden />
            </span>
            Campaign detail
          </p>
          <CampaignStatusBadge status={campaign.status} variant="onDark" />
          {campaign.isVerified ? (
            <span className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-100 ring-1 ring-inset ring-emerald-300/40">
              Verified
            </span>
          ) : null}
          {campaign.isFeatured ? (
            <span className="inline-flex rounded-full border border-amber-300/40 bg-amber-400/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-100 ring-1 ring-inset ring-amber-300/40">
              Featured
            </span>
          ) : null}
          <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100 ring-1 ring-inset ring-white/20">
            {campaignTypeLabel}
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          <h1 className={cn(titleClassNameCompact, 'capitalize')}>
            {titleMain}
            {titleHighlight ? (
              <>
                {' '}
                <span className="text-red-400">— {titleHighlight}</span>
              </>
            ) : null}
          </h1>

          <p className="m-0 line-clamp-2 text-sm leading-6 text-slate-300/95">
            {campaign.shortDescription}
          </p>

          {campaign.bloodGroupsNeeded.length > 0 ? (
            <div
              className="flex w-full min-w-0 flex-wrap gap-2"
              role="list"
              aria-label="Blood groups needed"
            >
              {campaign.bloodGroupsNeeded.map((group) => (
                <span
                  className="inline-flex shrink-0 items-center rounded-2xl border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/95 backdrop-blur-sm"
                  key={group}
                  role="listitem"
                >
                  {group}
                </span>
              ))}
            </div>
          ) : null}

          <p className="m-0 flex items-start gap-2 text-sm leading-6 text-slate-300/95">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
              aria-hidden
            />
            <span>
              <span className="font-medium text-white/90">{campaign.venue}</span>
              <span className="text-slate-400"> · {locationLabel}</span>
            </span>
          </p>
        </div>
      </div>
    </HeroBannerShell>
  );
}
