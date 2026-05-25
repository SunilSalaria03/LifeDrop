'use client';

import Image from 'next/image';
import { type ReactNode } from 'react';
import bannerImage from '@/assets/images/banner.png';
import { HERO_CAMPAIGNS_BANNER } from '@/components/landing/hero-banner.content';
import { getCampaignStats } from '../lib/campaign-filters';
import { BloodDonationCampaign } from '../types/campaign.types';

type CampaignHeroProps = {
  campaigns: BloodDonationCampaign[];
  filters: ReactNode;
};

export function CampaignHero({ campaigns, filters }: CampaignHeroProps) {
  const banner = HERO_CAMPAIGNS_BANNER;
  const BadgeIcon = banner.BadgeIcon;
  const stats = getCampaignStats(campaigns);

  return (
    <section className="relative min-h-[700px] overflow-hidden bg-slate-900">
      <div className="absolute inset-y-0 right-0 hidden w-[50%] lg:block">
        <Image
          src={bannerImage}
          alt="Blood donation campaigns"
          fill
          className="object-contain object-bottom opacity-85"
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

      <div className="relative mx-auto flex min-h-[700px] max-w-7xl px-4 py-16 pb-20 pt-12 sm:px-6 sm:py-20 sm:pb-24 lg:px-8 lg:py-24">
        <div className="grid w-full gap-7">
          <div className="grid max-w-2xl gap-5 md:max-w-3xl lg:max-w-[58%]">
            <p
              aria-label={banner.badgeAriaLabel}
              className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-300 backdrop-blur-sm sm:px-4 sm:tracking-[0.14em]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
                <BadgeIcon className="h-4 w-4" />
              </span>
              {banner.badgeText}
            </p>
            <h1 className="text-balance text-2xl font-bold uppercase leading-tight tracking-[0.06em] text-white sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl">
              {banner.titleBefore}
              <span className="text-red-400">{banner.titleHighlight}</span>
              {banner.titleMiddle}
              {banner.titleHighlight2 ? (
                <span className="text-red-400">{banner.titleHighlight2}</span>
              ) : null}
              {banner.titleAfter}
            </h1>

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {[
                { label: 'Upcoming', value: stats.upcoming },
                { label: 'Ongoing', value: stats.ongoing },
                { label: 'Cities', value: `${stats.cities}+` },
                { label: 'Registrations', value: `${stats.registrations}+` },
              ].map((item) => (
                <div
                  className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3"
                  key={item.label}
                >
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-red-200 sm:text-xs">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-xl font-black tabular-nums text-white sm:text-2xl">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            className="scroll-mt-20 grid w-full gap-4 rounded-4xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:scroll-mt-24 sm:p-4"
            id="campaign-filters"
          >
            {filters}
          </div>
        </div>
      </div>
    </section>
  );
}
