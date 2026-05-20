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

export const LIFEDROP_ABOUT_SECTION_ID = 'lifedrop-about';

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
      'Create your LifeDrop account and capture donor or requester basics so the network can match you accurately from the first search.',
    icon: UserPlus,
    iconClassName: 'bg-red-50 text-red-700 ring-red-100',
  },
  {
    title: 'Verify',
    description:
      'Complete verification so profiles, requests, and responses stay credible when every minute counts.',
    icon: BadgeCheck,
    iconClassName: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    title: 'Connect',
    description:
      'Filter by blood group, state, and city to surface eligible donors aligned with your situation—then reach out with confidence.',
    icon: Search,
    iconClassName: 'bg-sky-50 text-sky-700 ring-sky-100',
  },
  {
    title: 'Save Lives',
    description:
      'Move quickly from a strong match to a direct conversation so families and care teams can act while the window for help is still open.',
    icon: HeartPulse,
    iconClassName: 'bg-rose-50 text-rose-700 ring-rose-100',
  },
];

export const landingStats: LandingStat[] = [
  {
    label: 'Registered donors',
    value: '1,250',
    icon: UsersRound,
    iconClassName: 'bg-red-50 text-red-700 ring-red-100',
    valueClassName: 'text-red-700',
  },
  {
    label: 'Urgent matches supported',
    value: '380',
    icon: HeartPulse,
    iconClassName: 'bg-rose-50 text-rose-700 ring-rose-100',
    valueClassName: 'text-rose-700',
  },
  {
    label: 'Blood requests posted',
    value: '450',
    icon: ClipboardPlus,
    iconClassName: 'bg-sky-50 text-sky-700 ring-sky-100',
    valueClassName: 'text-sky-700',
  },
  {
    label: 'Cities with donor reach',
    value: '40',
    icon: MapPin,
    iconClassName: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    valueClassName: 'text-emerald-700',
  },
];

export const successStories: SuccessStory[] = [
  {
    name: 'Arvind Krishnan',
    city: 'Kochi, Kerala',
    bloodGroup: 'O+',
    message:
      'When my father needed support after surgery, the ward asked us to widen donor outreach beyond the blood bank queue. LifeDrop let us filter by O+ and Kochi so we could reach people nearby without guessing numbers from old posters. We connected with a donor the same afternoon—specific, calm, and far less stressful than chasing random group chats.',
    avatar: '',
  },
  {
    name: 'Deepak Yadav',
    city: 'Lucknow, Uttar Pradesh',
    bloodGroup: 'A+',
    message:
      'I donate when I can, but I dislike vague broadcasts that ignore distance and timing. Here I see blood group and area first, so I only respond when I can realistically reach the facility after work. Phone verification was quick, and two recent requests in Lucknow matched both my group and my schedule.',
    avatar: '',
  },
  {
    name: 'Priya Shah',
    city: 'Surat, Gujarat',
    bloodGroup: 'B+',
    message:
      'I do not share contact details unless I know exactly how they will be used. LifeDrop explained privacy in plain language, and donor profiles stayed easy to scan when everyone at home was already tense. Coordinating felt respectful on both sides—enough signal to decide fast, without pressure, even while coordinating across Surat neighbourhoods.',
    avatar: '',
  },
  {
    name: 'Ananya Ghosh',
    city: 'Kolkata, West Bengal',
    bloodGroup: 'A+',
    message:
      'I expected donor alerts to be noisy; instead I got a handful of timely, Kolkata-area requests I could answer the same day. Each listing had the basics upfront—blood type, neighbourhood, and how to respond—so I was not decoding long threads under time pressure. The path from notification to contact stayed straightforward.',
    avatar: '',
  },
  {
    name: 'Sunita Patil',
    city: 'Nagpur, Maharashtra',
    bloodGroup: 'B+',
    message:
      'During my uncle\'s admission we needed parallel options while blood bank paperwork moved. Nagpur-focused listings helped us prioritise who could arrive first instead of juggling relatives an hour away. It did not replace the hospital process, but it gave our family a clearer shortlist while we stayed with him in the ward.',
    avatar: '',
  },
];
