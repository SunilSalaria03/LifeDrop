'use client';

import Image from 'next/image';
import { MapPin, Megaphone } from 'lucide-react';
import bannerImage from '@/assets/images/banner.png';
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
    <section className="relative min-h-[640px] overflow-hidden bg-slate-900 sm:min-h-[680px]">
      <div className="absolute inset-y-0 right-0 hidden w-[50%] lg:block">
        <Image
          src={bannerImage}
          alt=""
          fill
          className="object-contain object-bottom opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/30" />
        <div className="absolute inset-y-0 left-0 w-64 bg-[linear-gradient(to_right,#0f172a,transparent)]" />
        <div className="absolute inset-y-0 right-0 w-16 bg-[linear-gradient(to_left,#0f172a,transparent)]" />
        <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(to_bottom,#0f172a,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,#0f172a,transparent)]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,1)_0%,rgba(15,23,42,1)_44%,rgba(15,23,42,0.70)_58%,rgba(15,23,42,0.25)_75%,rgba(15,23,42,0.15)_100%)]" />

      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.90),transparent)]" />

      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(15,23,42,1),transparent)]" />

      <div className="pointer-events-none absolute bottom-0 right-[22%] h-64 w-64 rounded-full bg-red-700/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[640px] max-w-7xl px-4 py-16 pb-20 pt-12 sm:min-h-[680px] sm:px-6 sm:py-20 sm:pb-24 lg:px-8 lg:py-24">
        <div className="grid w-full gap-7">
          <div className="grid max-w-2xl gap-5 md:max-w-3xl lg:max-w-[58%]">
            <div className="flex flex-wrap items-center gap-2">
              <p
                aria-label="Campaign detail page"
                className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-300 backdrop-blur-sm sm:px-4 sm:tracking-[0.14em]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
                  <Megaphone className="h-4 w-4" aria-hidden />
                </span>
                Campaign detail
              </p>
              <CampaignStatusBadge status={campaign.status} variant="onDark" />
            </div>

            <div className="flex flex-col gap-4 sm:gap-5">
              <h1 className="m-0 text-balance text-2xl font-bold uppercase leading-tight tracking-[0.06em] text-white sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl">
                {titleMain}
                {titleHighlight ? (
                  <>
                    {' '}
                    <span className="text-red-400">— {titleHighlight}</span>
                  </>
                ) : null}
              </h1>

              <p className="m-0 max-w-2xl text-sm leading-6 text-slate-300/95 sm:text-base">
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
        </div>
      </div>
    </section>
  );
}
