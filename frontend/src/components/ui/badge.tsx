import * as React from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold', className)}
      {...props}
    />
  );
}

export { Badge };

