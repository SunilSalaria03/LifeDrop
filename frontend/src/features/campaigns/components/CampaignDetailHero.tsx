'use client';

import { MapPin, Megaphone } from 'lucide-react';
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

  return (
    <HeroBannerShell
      contentClassName="flex-col justify-center py-14 sm:py-16 lg:py-20"
      minHeightClass="min-h-[520px] sm:min-h-[560px]"
    >
      <div className="grid w-full max-w-3xl gap-5 lg:max-w-[58%]">
        <div className="flex flex-wrap items-center gap-2">
          <p
            aria-label="Campaign detail page"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-300 backdrop-blur-sm sm:px-4 sm:tracking-[0.14em]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
              <Megaphone className="h-4 w-4" aria-hidden />
            </span>
            Campaign detail
          </p>
          <CampaignStatusBadge status={campaign.status} variant="onDark" />
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          <h1 className="m-0 text-balance text-2xl font-bold uppercase leading-tight tracking-[0.06em] text-white sm:text-3xl lg:text-4xl">
            {titleMain}
            {titleHighlight ? (
              <>
                {' '}
                <span className="text-red-400">— {titleHighlight}</span>
              </>
            ) : null}
          </h1>

          <p className="m-0 text-sm leading-6 text-slate-300/95 sm:text-base">
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
