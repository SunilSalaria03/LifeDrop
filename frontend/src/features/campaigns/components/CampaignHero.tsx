'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { ListChecks, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroBannerHeading } from '@/components/landing/HeroBannerHeading';
import { HeroBannerShell } from '@/components/landing/HeroBannerShell';
import { HERO_CAMPAIGNS_BANNER } from '@/components/landing/hero-banner.content';

type CampaignHeroProps = {
  filters: ReactNode;
};

export function CampaignHero({ filters }: CampaignHeroProps) {
  return (
    <HeroBannerShell
      contentClassName="flex-col justify-center py-16 pb-20 pt-12 sm:py-20 sm:pb-24 lg:py-24"
      size="tall"
    >
      <div className="grid w-full gap-7">
        <HeroBannerHeading banner={HERO_CAMPAIGNS_BANNER}>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="h-11 w-fit gap-2 rounded-full bg-red-700 px-6 text-white shadow-lg shadow-red-700/30 hover:bg-red-800"
            >
              <Link href="/campaigns/create">
                <Plus className="h-4 w-4" aria-hidden />
                Create Campaign
              </Link>
            </Button>
            <Button
              asChild
              className="h-11 w-fit gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-white hover:bg-white/20"
              variant="outline"
            >
              <Link href="/campaigns/my">
                <ListChecks className="h-4 w-4" aria-hidden />
                My Campaigns
              </Link>
            </Button>
          </div>
        </HeroBannerHeading>

        <div
          className="scroll-mt-20 grid w-full gap-4 rounded-4xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:scroll-mt-24 sm:p-4"
          id="campaign-filters"
        >
          {filters}
        </div>
      </div>
    </HeroBannerShell>
  );
}
