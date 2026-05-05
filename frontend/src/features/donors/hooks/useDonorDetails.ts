'use client';

import { useQuery } from '@tanstack/react-query';
import { getDonorById } from '../api/donors.api';

export function useDonorDetails(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ['donor-detail', id],
    queryFn: () => getDonorById(id),
    retry: 1,
  });
}
