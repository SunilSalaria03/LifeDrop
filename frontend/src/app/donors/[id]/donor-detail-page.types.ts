import type { LucideIcon } from 'lucide-react';
import { DonorDetail } from '@/features/donors/types/donor.types';

export type DetailItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export type DonorProfileHeaderProps = {
  donor: DonorDetail;
};
