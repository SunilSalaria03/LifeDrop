'use client';

import type { ReactNode } from 'react';
import type { HeroBannerContent } from './hero-banner.content';

type HeroBannerHeadingProps = {
  banner: HeroBannerContent;
  children?: ReactNode;
  className?: string;
};

const titleClassName =
  'text-balance text-2xl font-bold uppercase leading-tight tracking-[0.06em] text-white sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl';

function HeroBannerTitle({ banner }: { banner: HeroBannerContent }) {
  if (banner.titleLayout === 'stacked') {
    return (
      <h1 className={titleClassName}>
        {banner.titleBefore ? (
          <span className="block">{banner.titleBefore.trim()}</span>
        ) : null}
        {banner.titleHighlight ? (
          <span className="block text-red-400">{banner.titleHighlight.trim()}</span>
        ) : null}
        {banner.titleAfter ? (
          <span className="block">{banner.titleAfter.trim()}</span>
        ) : null}
      </h1>
    );
  }

  if (banner.titleLayout === 'split') {
    return (
      <h1 className={titleClassName}>
        <span className="block">
          {banner.titleBefore}
          <span className="text-red-400">{banner.titleHighlight}</span>
        </span>
        {banner.titleMiddle ? (
          <span className="block">{banner.titleMiddle.trim()}</span>
        ) : null}
        <span className="block">
          {banner.titleHighlight2 ? (
            <span className="text-red-400">{banner.titleHighlight2}</span>
          ) : null}
          {banner.titleAfter}
        </span>
      </h1>
    );
  }

  return (
    <h1 className={titleClassName}>
      {banner.titleBefore}
      <span className="text-red-400">{banner.titleHighlight}</span>
      {banner.titleMiddle}
      {banner.titleHighlight2 ? (
        <span className="text-red-400">{banner.titleHighlight2}</span>
      ) : null}
      {banner.titleAfter}
    </h1>
  );
}

export function HeroBannerHeading({
  banner,
  children,
  className,
}: HeroBannerHeadingProps) {
  const BadgeIcon = banner.BadgeIcon;

  return (
    <div className={className ?? 'grid max-w-2xl gap-5 md:max-w-3xl lg:max-w-[58%]'}>
      <p
        aria-label={banner.badgeAriaLabel}
        className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-300 backdrop-blur-sm sm:px-4 sm:tracking-[0.14em]"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
          <BadgeIcon className="h-4 w-4" aria-hidden />
        </span>
        {banner.badgeText}
      </p>
      <HeroBannerTitle banner={banner} />
      {children}
    </div>
  );
}
