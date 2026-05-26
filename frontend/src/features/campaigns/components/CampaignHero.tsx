'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroBannerHeading } from '@/components/landing/HeroBannerHeading';
import { HeroBannerShell } from '@/components/landing/HeroBannerShell';
import { HERO_CAMPAIGNS_BANNER } from '@/components/landing/hero-banner.content';

type CampaignHeroProps = {
  filters: ReactNode;
};

export function CampaignHero({ filters }: CampaignHeroProps) {
  return (
    <HeroBannerShell contentClassName="flex-col justify-center py-16 pb-20 pt-12 sm:py-20 sm:pb-24 lg:py-24">
      <div className="grid w-full gap-7">
        <HeroBannerHeading banner={HERO_CAMPAIGNS_BANNER}>
          <Button
            asChild
            className="h-11 w-fit gap-2 rounded-full bg-red-700 px-6 text-white shadow-lg shadow-red-700/30 hover:bg-red-800"
          >
            <Link href="/campaigns/create">
              <Plus className="h-4 w-4" aria-hidden />
              Create Campaign
            </Link>
          </Button>
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
