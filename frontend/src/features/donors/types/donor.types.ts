export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type DonorSearchFilters = {
  bloodGroup: string;
  state?: string;
  city?: string;
  district?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
};

export type DonorProfilePayload = {
  bloodGroup: string;
  phone: string;
  alternatePhone?: string;
  state: string;
  city: string;
  district?: string;
  addressText?: string;
  lat: number;
  lng: number;
  lastDonationDate?: string;
  isAvailable?: boolean;
};

export type DonorListItem = {
  id: string;
  userId?: string;
  name?: string;
  profileImage?: string;
  bloodGroup: string;
  state: string;
  city: string;
  district?: string;
  distanceKm?: number;
  isAvailable: boolean;
  isVerified?: boolean;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  totalDonations?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type DonorDetail = DonorListItem;

export type MyDonorProfile = DonorListItem & {
  phone?: string;
  alternatePhone?: string;
  addressText?: string;
};

export type DonorSearchResponse = {
  items: DonorListItem[];
  count: number;
  radiusKm: number;
};
