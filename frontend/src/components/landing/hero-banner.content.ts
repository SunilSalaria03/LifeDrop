import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Droplet,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Megaphone,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
  UserSearch,
} from 'lucide-react';

export type HeroBannerStep = {
  label: string;
  Icon: LucideIcon;
};

export type HeroBannerContent = {
  badgeAriaLabel: string;
  badgeText: string;
  BadgeIcon: LucideIcon;
  titleBefore: string;
  titleHighlight: string;
  titleMiddle?: string;
  titleHighlight2?: string;
  titleAfter: string;
  steps: HeroBannerStep[];
  stepsGroupAriaLabel: string;
  footnote: string;
  /**
   * stacked: one segment per line (before / highlight / after).
   * split: three lines with highlights on lines 1 and 3 (donor-detail style).
   */
  titleLayout?: 'stacked' | 'split' | 'inline';
};

export const HERO_SEARCH_BANNER: HeroBannerContent = {
  badgeAriaLabel: 'Minutes matter. Nearby donors for urgent blood needs.',
  badgeText: 'Minutes matter · nearby donors',
  BadgeIcon: HeartPulse,
  titleBefore: 'Search donors ',
  titleHighlight: 'by blood group and location',
  titleAfter: ' across your city',
  steps: [
    { label: 'Blood group', Icon: Droplet },
    { label: 'State', Icon: MapPin },
    { label: 'City / area', Icon: Building2 },
    { label: 'Search donors', Icon: UserSearch },
  ],
  stepsGroupAriaLabel:
    'How search works: choose blood group, then state, then city or area, run search donors, then contact donors from the results.',
  footnote: 'Then contact donors who appear in your results.',
};

export const HERO_BECOME_DONOR_BANNER: HeroBannerContent = {
  badgeAriaLabel: 'Join as a donor and help people who need blood.',
  badgeText: 'Join as a donor',
  BadgeIcon: HeartHandshake,
  titleBefore: 'Join as a donor and serve ',
  titleHighlight: 'people in need',
  titleAfter: ' in your area',
  steps: [
    { label: 'Blood group', Icon: Droplet },
    { label: 'Location', Icon: MapPin },
    { label: 'Go live', Icon: ShieldCheck },
  ],
  stepsGroupAriaLabel:
    'Registration: add blood group and location, then go live in donor search.',
  footnote: 'Register below to join LifeDrop as a donor.',
};

export const HERO_PROFILE_BANNER: HeroBannerContent = {
  badgeAriaLabel: 'Your LifeDrop profile.',
  badgeText: 'Your profile',
  BadgeIcon: UserRound,
  titleBefore: 'Manage your profile and stay ',
  titleHighlight: 'ready to help',
  titleAfter: ' when needed',
  steps: [
    { label: 'Contact', Icon: Phone },
    { label: 'Location', Icon: MapPin },
    { label: 'Donor details', Icon: HeartHandshake },
  ],
  stepsGroupAriaLabel:
    'Profile: update contact, location, and donor details below.',
  footnote: 'Keep your details accurate in the sections below.',
};

export const HERO_CAMPAIGNS_BANNER: HeroBannerContent = {
  badgeAriaLabel: 'Public campaign directory. No login required.',
  badgeText: 'Public directory · no login required',
  BadgeIcon: Megaphone,
  titleBefore: 'Blood donation',
  titleHighlight: 'campaigns',
  titleAfter: 'across your city',
  titleLayout: 'stacked',
  steps: [],
  stepsGroupAriaLabel: '',
  footnote: '',
};

export const HERO_CREATE_CAMPAIGN_BANNER: HeroBannerContent = {
  badgeAriaLabel: 'Organize a blood donation drive on LifeDrop.',
  badgeText: 'Organize a drive',
  BadgeIcon: Megaphone,
  titleBefore: 'Create a ',
  titleHighlight: 'blood donation',
  titleMiddle: 'campaign for donors in',
  titleHighlight2: 'your city',
  titleAfter: '',
  titleLayout: 'split',
  steps: [
    { label: 'Campaign details', Icon: Megaphone },
    { label: 'Venue & dates', Icon: MapPin },
    { label: 'Submit listing', Icon: Send },
  ],
  stepsGroupAriaLabel:
    'Listing: add campaign details, venue and dates, then submit for review.',
  footnote: 'Complete the form below to list your drive for donors near you.',
};

export const HERO_ONBOARDING_BANNER: HeroBannerContent = {
  badgeAriaLabel: 'Complete your LifeDrop account setup.',
  badgeText: 'Account setup',
  BadgeIcon: UserRound,
  titleBefore: 'Complete your ',
  titleHighlight: 'LifeDrop profile',
  titleAfter: ' to get started',
  steps: [],
  stepsGroupAriaLabel: '',
  footnote: '',
};

export const HERO_PROFILE_SETUP_BANNER: HeroBannerContent = {
  badgeAriaLabel: 'Verify your phone and location on LifeDrop.',
  badgeText: 'Profile setup',
  BadgeIcon: ShieldCheck,
  titleBefore: 'Finish your profile and stay ',
  titleHighlight: 'ready to help',
  titleAfter: '',
  steps: [],
  stepsGroupAriaLabel: '',
  footnote: '',
};

export type HeroBannerVariant =
  | 'search'
  | 'becomeDonor'
  | 'profile'
  | 'donorDetail'
  | 'campaigns'
  | 'createCampaign'
  | 'onboarding'
  | 'profileSetup';


export function getHeroBannerVariant(pathname: string): HeroBannerVariant {
  if (pathname === '/become-donor') {
    return 'becomeDonor';
  }

  if (pathname === '/campaigns/create') {
    return 'createCampaign';
  }

  if (pathname === '/campaigns' || pathname.startsWith('/campaigns/')) {
    return 'campaigns';
  }

  if (pathname === '/onboarding') {
    return 'onboarding';
  }

  if (pathname === '/profile/setup') {
    return 'profileSetup';
  }

  if (pathname === '/donor-list') {
    return 'search';
  }

  if (pathname === '/profile') {
    return 'profile';
  }

  if (pathname.startsWith('/donors/') && pathname.length > '/donors/'.length) {
    return 'donorDetail';
  }

  return 'search';
}

export const HERO_DONOR_DETAIL_BANNER: HeroBannerContent = {
  badgeAriaLabel: 'Find donor details on LifeDrop.',
  badgeText: 'Donor profile',
  BadgeIcon: HeartHandshake,
  titleBefore: 'Need blood urgently?',
  titleHighlight: 'View donor details',
  titleAfter: 'and request support quickly',
  titleLayout: 'stacked',
  steps: [
    { label: 'Blood group', Icon: Droplet },
    { label: 'Location', Icon: MapPin },
  ],
  stepsGroupAriaLabel:
    'Check blood group and location before sending a request.',
  footnote: 'Review eligibility and send a request if the donor is available.',
};

export function getHeroBannerContent(pathname: string): HeroBannerContent {
  const variant = getHeroBannerVariant(pathname);

  if (variant === 'becomeDonor') {
    return HERO_BECOME_DONOR_BANNER;
  }

  if (variant === 'profile') {
    return HERO_PROFILE_BANNER;
  }

  if (variant === 'donorDetail') {
    return HERO_DONOR_DETAIL_BANNER;
  }

  if (variant === 'campaigns') {
    return HERO_CAMPAIGNS_BANNER;
  }

  if (variant === 'createCampaign') {
    return HERO_CREATE_CAMPAIGN_BANNER;
  }

  if (variant === 'onboarding') {
    return HERO_ONBOARDING_BANNER;
  }

  if (variant === 'profileSetup') {
    return HERO_PROFILE_SETUP_BANNER;
  }

  return HERO_SEARCH_BANNER;
}
