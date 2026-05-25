'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DonorListPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
};

function getVisiblePages(page: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from(
    { length: end - adjustedStart + 1 },
    (_, index) => adjustedStart + index,
  );
}

export function DonorListPagination({
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  className,
}: DonorListPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav
      aria-label="Donor results pagination"
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
    >
      <Button
        aria-label="Previous page"
        className="h-10 px-4"
        disabled={page <= 1 || isLoading}
        onClick={() => onPageChange(page - 1)}
        type="button"
        variant="outline"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {visiblePages.map((pageNumber) => (
          <Button
            aria-current={pageNumber === page ? 'page' : undefined}
            aria-label={`Page ${pageNumber}`}
            className={cn(
              'h-10 min-w-10 px-3',
              pageNumber === page && 'bg-red-700 text-white hover:bg-red-800',
            )}
            disabled={isLoading}
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            type="button"
            variant={pageNumber === page ? 'default' : 'outline'}
          >
            {pageNumber}
          </Button>
        ))}
      </div>

      <Button
        aria-label="Next page"
        className="h-10 px-4"
        disabled={page >= totalPages || isLoading}
        onClick={() => onPageChange(page + 1)}
        type="button"
        variant="outline"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
