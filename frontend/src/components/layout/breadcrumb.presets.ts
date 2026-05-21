import { BreadcrumbItem } from './breadcrumb.types';

export const breadcrumbProfile: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Profile' },
];

export const breadcrumbBecomeDonor: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Join as a donor' },
];

export const breadcrumbProfileSetup: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Profile', href: '/profile' },
  { label: 'Complete profile' },
];

export const breadcrumbOnboarding: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Onboarding' },
];

export function breadcrumbDonorDetail(donorName?: string): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Find donors', href: '/#landing-donor-search' },
    { label: donorName?.trim() || 'Donor profile' },
  ];
}
