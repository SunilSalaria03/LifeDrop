'use client';

import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { HeroBannerHeading } from './HeroBannerHeading';
import { HeroBannerShell } from './HeroBannerShell';
import { getHeroBannerContent } from './hero-banner.content';

type PageHeroProps = {
  contentClassName?: string;
};

/** Compact 400px hero for pages that use banner content from the current pathname. */
export function PageHero({
  contentClassName = 'flex-col justify-center py-8 sm:py-10',
}: PageHeroProps) {
  const pathname = usePathname();
  const banner = getHeroBannerContent(pathname);

  return (
    <HeroBannerShell contentClassName={contentClassName} size="compact">
      <HeroBannerHeading banner={banner} size="compact">
        {banner.footnote ? (
          <p className="flex items-start gap-2 text-xs leading-6 text-slate-300/95 sm:text-sm">
            <Sparkles
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/90"
              aria-hidden
            />
            <span>{banner.footnote}</span>
          </p>
        ) : null}
      </HeroBannerHeading>
    </HeroBannerShell>
  );
}
