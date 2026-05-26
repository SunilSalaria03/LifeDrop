'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import bannerImage from '@/assets/images/banner.png';

type HeroBannerShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  minHeightClass?: string;
  imageAlt?: string;
  imagePriority?: boolean;
};

export function HeroBannerShell({
  children,
  className,
  contentClassName,
  minHeightClass = 'min-h-[700px]',
  imageAlt = 'LifeDrop blood donation',
  imagePriority = false,
}: HeroBannerShellProps) {
  return (
    <section
      className={cn('relative overflow-hidden bg-slate-900', minHeightClass, className)}
    >
      <div className="absolute inset-y-0 right-0 hidden w-[50%] lg:block">
        <Image
          src={bannerImage}
          alt={imageAlt}
          fill
          className="object-contain object-bottom opacity-85"
          priority={imagePriority}
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

      <div
        className={cn(
          'relative mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8',
          minHeightClass,
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
