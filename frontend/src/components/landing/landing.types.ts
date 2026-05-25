import { LucideIcon } from 'lucide-react';
import { DonorListItem } from '@/features/donors/types/donor.types';

export type DonorSearchFormValues = {
  bloodGroup: string;
  state: string;
  stateCode: string;
  city: string;
  lat?: number;
  lng?: number;
};

export type SearchBarProps = {
  values: DonorSearchFormValues;
  isSearching: boolean;
  onChange: (values: DonorSearchFormValues) => void;
  onSearch: () => void;
};

export type DonorCardProps = {
  donor: DonorListItem;
  hideRequestButton?: boolean;
  onRequest?: (donor: DonorListItem) => void;
};

export type DonorListMode = 'preview' | 'paginated';

export type DonorListProps = {
  donors: DonorListItem[];
  isLoading: boolean;
  hasSearched: boolean;
  errorMessage?: string;
  mode?: DonorListMode;
  totalCount?: number;
  page?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  viewAllHref?: string;
  showViewAll?: boolean;
};

export type LandingAction = {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  button: string;
};

export type LandingStep = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
};

export type LandingStat = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName: string;
  valueClassName: string;
};

export type SuccessStory = {
  name: string;
  city: string;
  bloodGroup: string;
  message: string;
  avatar: string;
};
