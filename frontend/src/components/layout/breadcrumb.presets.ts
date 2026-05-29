import { BreadcrumbItem } from './breadcrumb.types';

export const breadcrumbProfile: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Profile' },
];

export const breadcrumbBecomeDonor: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Join as a donor' },
];

export const breadcrumbDonorList: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Donor List' },
];

export const breadcrumbCampaigns: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Campaigns' },
];

export const breadcrumbCreateCampaign: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'Create a Campaign' },
];

export const breadcrumbMyCampaigns: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'My Campaigns' },
];

export function breadcrumbEditCampaign(campaignTitle?: string): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'My Campaigns', href: '/campaigns/my' },
    { label: campaignTitle?.trim() || 'Edit campaign' },
  ];
}

export function breadcrumbCampaignDetail(campaignTitle: string): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: campaignTitle },
  ];
}

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
    { label: 'Donor List', href: '/donor-list' },
    { label: donorName?.trim() || 'Donor profile' },
  ];
}
