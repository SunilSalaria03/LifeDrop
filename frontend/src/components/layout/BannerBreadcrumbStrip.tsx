import { cn } from '@/lib/utils';
import { PageBreadcrumb } from './PageBreadcrumb';
import { BreadcrumbItem } from './breadcrumb.types';

type BannerBreadcrumbStripProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function BannerBreadcrumbStrip({
  items,
  className,
}: BannerBreadcrumbStripProps) {
  return (
    <div
      className={cn(
        'w-full border-b border-white/15 bg-slate-900 pt-16 sm:pt-18',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8">
        <PageBreadcrumb items={items} variant="onDark" />
      </div>
    </div>
  );
}
