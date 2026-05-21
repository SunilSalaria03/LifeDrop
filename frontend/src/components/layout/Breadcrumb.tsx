import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BreadcrumbProps } from './breadcrumb.types';

export function Breadcrumb({
  items,
  className,
  variant = 'default',
}: BreadcrumbProps) {
  const isOnBanner = variant === 'onDark';

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol
        className={cn(
          'flex flex-wrap items-center',
          isOnBanner ? 'gap-x-2 gap-y-1 text-[13px] leading-5' : 'gap-1 text-sm',
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isLink = Boolean(item.href) && !isLast;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex min-w-0 items-center gap-2"
            >
              {index > 0 ? (
                isOnBanner ? (
                  <span
                    aria-hidden
                    className="select-none text-white/25"
                  >
                    /
                  </span>
                ) : (
                  <ChevronRight
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 text-neutral-300"
                  />
                )
              ) : null}
              {isLink ? (
                <Link
                  className={cn(
                    'truncate transition-colors',
                    isOnBanner
                      ? 'font-normal text-slate-300/95 hover:text-red-300'
                      : 'font-medium text-neutral-500 hover:text-red-700',
                  )}
                  href={item.href!}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'truncate',
                    isOnBanner
                      ? isLast
                        ? 'font-medium text-white/95'
                        : 'font-normal text-slate-300/95'
                      : isLast
                        ? 'font-medium text-neutral-900'
                        : 'font-medium text-neutral-500',
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
