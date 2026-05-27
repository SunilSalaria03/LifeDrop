'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { HeroBannerContent } from './hero-banner.content';
import type { HeroBannerSize } from './hero-banner.constants';

type HeroBannerHeadingProps = {
  banner: HeroBannerContent;
  children?: ReactNode;
  className?: string;
  size?: HeroBannerSize;
};

const titleClassNameTall =
  'text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.35rem]';

const titleClassNameCompact =
  'text-balance text-2xl font-semibold leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-[2.1rem]';

function HeroBannerTitle({
  banner,
  size = 'tall',
}: {
  banner: HeroBannerContent;
  size?: HeroBannerSize;
}) {
  const titleClassName =
    size === 'compact' ? titleClassNameCompact : titleClassNameTall;

  if (banner.titleLayout === 'stacked') {
    return (
      <h1 className={cn(titleClassName, 'capitalize')}>
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
      <h1 className={cn(titleClassName, 'capitalize')}>
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
    <h1 className={cn(titleClassName, 'capitalize')}>
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
  size = 'tall',
}: HeroBannerHeadingProps) {
  const BadgeIcon = banner.BadgeIcon;
  const isCompact = size === 'compact';

  return (
    <div
      className={cn(
        'grid max-w-2xl md:max-w-3xl lg:max-w-[58%]',
        isCompact ? 'gap-3' : 'gap-5',
        className,
      )}
    >
      <p
        aria-label={banner.badgeAriaLabel}
        className={cn(
          'inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 font-semibold leading-snug text-red-300 backdrop-blur-sm',
          isCompact
            ? 'px-3 py-1.5 text-xs tracking-[0.08em]'
            : 'px-3 py-2 text-[14px] tracking-[0.12em] sm:px-4 sm:tracking-[0.14em]',
        )}
      >
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50',
            isCompact ? 'h-6 w-6' : 'h-7 w-7',
          )}
        >
          <BadgeIcon
            className={cn(isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4')}
            aria-hidden
          />
        </span>
        {banner.badgeText}
      </p>
      <HeroBannerTitle banner={banner} size={size} />
      {children}
    </div>
  );
}

export { titleClassNameCompact, titleClassNameTall };
