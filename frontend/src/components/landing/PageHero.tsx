'use client';

import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { HeroBannerHeading } from './HeroBannerHeading';
import { HeroBannerShell } from './HeroBannerShell';
import { getHeroBannerContent } from './hero-banner.content';

type PageHeroProps = {
  minHeightClass?: string;
  contentClassName?: string;
};

/** Compact hero for pages that use banner content from the current pathname. */
export function PageHero({
  minHeightClass = 'min-h-[420px] sm:min-h-[460px]',
  contentClassName = 'flex-col justify-center py-12 sm:py-14 lg:py-16',
}: PageHeroProps) {
  const pathname = usePathname();
  const banner = getHeroBannerContent(pathname);

  return (
    <HeroBannerShell
      contentClassName={contentClassName}
      minHeightClass={minHeightClass}
    >
      <HeroBannerHeading banner={banner}>
        {banner.footnote ? (
          <p className="flex items-start gap-2 text-sm leading-7 text-slate-300/95">
            <Sparkles
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/90"
              aria-hidden
            />
            <span>{banner.footnote}</span>
          </p>
        ) : null}
      </HeroBannerHeading>
    </HeroBannerShell>
  );
}
