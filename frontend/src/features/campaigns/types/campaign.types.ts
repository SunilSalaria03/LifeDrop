export type CampaignStatus = 'upcoming' | 'ongoing' | 'completed';
export type BackendCampaignStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled';
export type CampaignType = 'blood_donation' | 'awareness' | 'health_checkup';
export type DonationType = 'whole_blood' | 'plasma' | 'platelets';
export type OrganizerType =
  | 'individual'
  | 'hospital'
  | 'ngo'
  | 'college'
  | 'company';
export type CampaignApprovalStatus = 'pending' | 'approved' | 'rejected';

export type BloodDonationCampaign = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  type?: CampaignType;
  backendStatus?: BackendCampaignStatus;
  organizerType?: OrganizerType;
  city: string;
  state: string;
  district: string;
  venue: string;
  address: string;
  landmark?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  pincode: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  organizer: string;
  organizerPhone?: string;
  organizerEmail?: string;
  organizerWebsite?: string;
  bloodGroupsNeeded: string[];
  donationTypes?: DonationType[];
  registrationCount?: number;
  capacity?: number;
  hasCapacity?: boolean;
  allowWalkIn?: boolean;
  registrationRequired?: boolean;
  contactPerson?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  images?: {
    bannerUrl?: string;
    thumbnailUrl?: string;
  };
  highlights: string[];
  scheduleNotes: string;
  eligibilityNotes: string;
  instructions?: string;
};

export type CampaignFilterValues = {
  search: string;
  type: string;
  city: string;
  state: string;
  status: string;
  month: string;
};

export type BackendCampaign = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  type?: CampaignType;
  status?: BackendCampaignStatus;
  organizer?: {
    name?: string;
    type?: OrganizerType;
    phone?: string;
    email?: string;
    website?: string;
  };
  location?: {
    city?: string;
    state?: string;
    district?: string;
    venue?: string;
    address?: string;
    pincode?: string;
    landmark?: string;
  };
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  bloodGroupsNeeded?: string[];
  donationTypes?: DonationType[];
  capacity?: number;
  registrationCount?: number;
  allowWalkIn?: boolean;
  registrationRequired?: boolean;
  contactPerson?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  images?: {
    bannerUrl?: string;
    thumbnailUrl?: string;
  };
  isVerified?: boolean;
  isFeatured?: boolean;
  highlights?: string[];
  scheduleNotes?: string;
  eligibilityNotes?: string;
  instructions?: string;
};

export type CampaignListResponse = {
  items: BackendCampaign[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CampaignListParams = {
  search?: string;
  type?: CampaignType;
  city?: string;
  state?: string;
  status?: BackendCampaignStatus;
  month?: string;
  page?: number;
  limit?: number;
  sortBy?: 'startDate' | 'endDate' | 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
};

export type MyCampaignListParams = {
  search?: string;
  status?: BackendCampaignStatus;
  page?: number;
  limit?: number;
};

export type CreateCampaignPayload = {
  title: string;
  shortDescription: string;
  description: string;
  type: CampaignType;
  organizer: {
    name: string;
    type: OrganizerType;
    phone?: string;
    email?: string;
  };
  location: {
    venue: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  bloodGroupsNeeded?: string[];
  donationTypes?: DonationType[];
  capacity?: number;
  registrationRequired?: boolean;
  allowWalkIn?: boolean;
  contactPerson?: {
    name?: string;
    phone?: string;
    email?: string;
  };
};

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>;

export const CAMPAIGN_STATUS_OPTIONS = [
  { value: 'all', label: 'All campaigns' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
] as const;

export const CAMPAIGN_TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'blood_donation', label: 'Blood donation' },
  { value: 'awareness', label: 'Awareness' },
  { value: 'health_checkup', label: 'Health checkup' },
] as const;

export const CAMPAIGN_MONTH_ALL = 'all';
