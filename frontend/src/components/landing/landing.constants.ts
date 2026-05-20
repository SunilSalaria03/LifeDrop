import {
  AlertTriangle,
  BadgeCheck,
  ClipboardPlus,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Search,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import {
  DonorSearchFormValues,
  LandingAction,
  LandingStat,
  LandingStep,
  SuccessStory,
} from './landing.types';

export const initialDonorSearchFilters: DonorSearchFormValues = {
  bloodGroup: '',
  state: '',
  stateCode: '',
  city: '',
  lat: undefined,
  lng: undefined,
};

export const landingActions: LandingAction[] = [
  {
    title: 'Request Blood',
    description: 'Create an urgent request and reach nearby donors who match your blood need.',
    buttonLabel: 'Request Now',
    href: '/request-blood',
    icon: AlertTriangle,
    accent: 'text-[#E74C3C]',
    button: 'bg-[#E74C3C] hover:bg-red-600',
  },
  {
    title: 'Donate Blood',
    description: 'Register as a donor and make yourself available for people in your city.',
    buttonLabel: 'Join as a Donor',
    href: '/become-donor',
    icon: HeartHandshake,
    accent: 'text-[#27AE60]',
    button: 'bg-[#27AE60] hover:bg-green-700',
  },
];

export const landingSteps: LandingStep[] = [
  {
    title: 'Register',
    description:
      'Create your LifeDrop account and add your basic donor or requester details.',
    icon: UserPlus,
    iconClassName: 'bg-red-50 text-red-700 ring-red-100',
  },
  {
    title: 'Verify',
    description:
      'Confirm your profile so nearby blood requests stay trusted and reliable.',
    icon: BadgeCheck,
    iconClassName: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    title: 'Connect',
    description:
      'Search by blood group and location to find eligible donors around you.',
    icon: Search,
    iconClassName: 'bg-sky-50 text-sky-700 ring-sky-100',
  },
  {
    title: 'Save Lives',
    description:
      'Coordinate quickly and help someone get blood when every minute matters.',
    icon: HeartPulse,
    iconClassName: 'bg-rose-50 text-rose-700 ring-rose-100',
  },
];

export const landingStats: LandingStat[] = [
  {
    label: 'Registered Donors',
    value: '1,250',
    icon: UsersRound,
    iconClassName: 'bg-red-50 text-red-700 ring-red-100',
    valueClassName: 'text-red-700',
  },
  {
    label: 'Lives Saved',
    value: '380',
    icon: HeartPulse,
    iconClassName: 'bg-rose-50 text-rose-700 ring-rose-100',
    valueClassName: 'text-rose-700',
  },
  {
    label: 'Blood Requests',
    value: '450',
    icon: ClipboardPlus,
    iconClassName: 'bg-sky-50 text-sky-700 ring-sky-100',
    valueClassName: 'text-sky-700',
  },
  {
    label: 'Cities Covered',
    value: '40',
    icon: MapPin,
    iconClassName: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    valueClassName: 'text-emerald-700',
  },
];

export const successStories: SuccessStory[] = [
  {
    name: 'Chaman Singh',
    city: 'Mohali',
    bloodGroup: 'O+',
    message:
      'LifeDrop helped us find a nearby donor quickly during an emergency. The search was simple and reassuring.',
    avatar: '',
  },
  {
    name: 'Rohit Sharma',
    city: 'Chandigarh',
    bloodGroup: 'A+',
    message:
      'I registered as a donor and got connected with a real request in my city. The process felt clear and respectful.',
    avatar: '',
  },
  {
    name: 'Aniket Sharma',
    city: 'Panchkula',
    bloodGroup: 'B+',
    message:
      'The donor details were easy to review, and the privacy note made the experience feel trustworthy.',
    avatar: '',
  },
  {
    name: 'Shivam Plaha',
    city: 'Chandigarh',
    bloodGroup: 'A+',
    message:
      'I registered as a donor and got connected with a real request in my city. The process felt clear and respectful.',
    avatar: '',
  },
  {
    name: 'Sachin Arora',
    city: 'Panchkula',
    bloodGroup: 'B+',
    message:
      'The donor details were easy to review, and the privacy note made the experience feel trustworthy.',
    avatar: '',
  },
];
