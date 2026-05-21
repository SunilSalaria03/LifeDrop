import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Droplet,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Phone,
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
  footnote: 'Then contact donors who appear in your results',
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
  footnote: 'Register below to join LifeDrop as a donor',
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

export type HeroBannerVariant = 'search' | 'becomeDonor' | 'profile' | 'donorDetail';


export function getHeroBannerVariant(pathname: string): HeroBannerVariant {
  if (pathname === '/become-donor') {
    return 'becomeDonor';
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
  badgeText: 'Find a donor',
  BadgeIcon: HeartHandshake,
  titleBefore: 'Donors are ',
  titleHighlight: 'superheroes',
  titleMiddle: ' find donor details for those ',
  titleHighlight2: 'who serve',
  titleAfter: '',
  steps: [
    { label: 'Blood group', Icon: Droplet },
    { label: 'Location', Icon: MapPin },
    { label: 'Request blood', Icon: HeartHandshake },
  ],
  stepsGroupAriaLabel:
    'Review blood group and location, then send a blood request below.',
  footnote: 'Then send a request if this donor is available.',
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

  return HERO_SEARCH_BANNER;
}
