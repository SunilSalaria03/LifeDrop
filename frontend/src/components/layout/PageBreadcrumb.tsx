import { cn } from '@/lib/utils';
import { Breadcrumb } from './Breadcrumb';
import { BreadcrumbItem } from './breadcrumb.types';

type PageBreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'default' | 'onDark';
};

export function PageBreadcrumb({
  items,
  className,
  variant = 'default',
}: PageBreadcrumbProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl', className)}>
      <Breadcrumb items={items} variant={variant} />
    </div>
  );
}
