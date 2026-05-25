import { cn } from '@/lib/utils';
import { PageBreadcrumb } from './PageBreadcrumb';
import { BreadcrumbItem } from './breadcrumb.types';

type BannerBreadcrumbStripProps = {
  items: BreadcrumbItem[];
  className?: string;
  overlay?: boolean;
};

export function BannerBreadcrumbStrip({
  items,
  className,
  overlay = false,
}: BannerBreadcrumbStripProps) {
  return (
    <div
      className={cn(
        overlay
          ? 'absolute left-0 right-0 top-0 z-30 w-full border-b border-white/10 bg-transparent'
          : 'w-full border-b border-white/15 bg-slate-900 pt-16 sm:pt-18',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
          overlay ? 'pb-3 pt-16 sm:pb-3.5 sm:pt-18' : 'py-3 sm:py-3.5',
        )}
      >
        <PageBreadcrumb items={items} variant="onDark" />
      </div>
    </div>
  );
}
