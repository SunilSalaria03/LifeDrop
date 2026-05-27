'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import bannerImage from '@/assets/images/banner.png';
import {
  getHeroBannerHeightClass,
  type HeroBannerSize,
} from './hero-banner.constants';

type HeroBannerShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** @deprecated Prefer `size`. Kept for one-off overrides. */
  minHeightClass?: string;
  size?: HeroBannerSize;
  imageAlt?: string;
  imagePriority?: boolean;
};

export function HeroBannerShell({
  children,
  className,
  contentClassName,
  minHeightClass,
  size = 'tall',
  imageAlt = 'LifeDrop blood donation',
  imagePriority = false,
}: HeroBannerShellProps) {
  const heightClass = minHeightClass ?? getHeroBannerHeightClass(size);
  const isCompact = size === 'compact';

  return (
    <section
      className={cn('relative overflow-hidden bg-slate-900', heightClass, className)}
    >
      <div
        className={cn(
          'absolute inset-y-0 right-0 hidden w-[50%] bg-slate-900 lg:block',
        )}
      >
        <Image
          src={bannerImage}
          alt={imageAlt}
          fill
          className={cn(
            'opacity-85',
            isCompact
              ? 'object-cover object-top !h-[calc(100%+75px)] -translate-y-[75px]'
              : 'object-contain object-bottom',
          )}
          priority={imagePriority}
        />
        <div
          className={cn(
            'absolute inset-0 bg-slate-900/35',
            isCompact && 'bg-slate-900/55',
          )}
        />
        <div className="absolute inset-y-0 left-0 w-72 bg-[linear-gradient(to_right,#0f172a,transparent)]" />
        <div className="absolute inset-y-0 right-0 w-24 bg-[linear-gradient(to_left,#020617,transparent)]" />
        <div
          className={cn(
            'absolute inset-x-0 top-0 bg-[linear-gradient(to_bottom,#0f172a,transparent)]',
            isCompact ? 'h-8' : 'h-36',
          )}
        />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,#0f172a,transparent)]',
            isCompact ? 'h-12' : 'h-24',
          )}
        />
      </div>

      <div
        className={cn(
          'absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,1)_0%,rgba(15,23,42,1)_42%,rgba(15,23,42,0.78)_58%,rgba(15,23,42,0.32)_76%,rgba(15,23,42,0.16)_100%)]',
          isCompact &&
            'bg-[linear-gradient(to_right,rgba(15,23,42,1)_0%,rgba(15,23,42,1)_46%,rgba(15,23,42,0.9)_62%,rgba(15,23,42,0.42)_80%,rgba(15,23,42,0.18)_100%)]',
        )}
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.18),transparent_60%)]" />

      <div
        className={cn(
          'absolute inset-x-0 top-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.90),transparent)]',
          isCompact ? 'h-8' : 'h-28',
        )}
      />

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(15,23,42,1),transparent)]',
          isCompact ? 'h-14' : 'h-28',
        )}
      />

      <div
        className={cn(
          'pointer-events-none absolute rounded-full bg-red-700/20 blur-3xl',
          isCompact
            ? 'bottom-0 right-[18%] h-40 w-40'
            : 'bottom-0 right-[22%] h-64 w-64',
        )}
      />

      <div
        className={cn(
          'relative mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8',
          heightClass,
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
