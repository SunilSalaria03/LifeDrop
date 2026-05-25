export type CampaignStatus = 'upcoming' | 'ongoing' | 'completed';

export type BloodDonationCampaign = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  city: string;
  state: string;
  district: string;
  venue: string;
  address: string;
  pincode: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  organizer: string;
  organizerPhone?: string;
  organizerEmail?: string;
  bloodGroupsNeeded: string[];
  registrationCount: number;
  capacity: number;
  highlights: string[];
  scheduleNotes: string;
  eligibilityNotes: string;
};

export type CampaignFilterValues = {
  city: string;
  state: string;
  status: string;
  month: string;
};

export const CAMPAIGN_STATUS_OPTIONS = [
  { value: 'all', label: 'All campaigns' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
] as const;

export const CAMPAIGN_MONTH_ALL = 'all';
