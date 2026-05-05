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

export type DonorSearchResult = {
  id: string;
  userId: string;
  name: string;
  profileImage?: string;
  bloodGroup: string;
  state: string;
  city: string;
  district?: string;
  isAvailable: boolean;
  distanceKm?: number;
  lastDonationDate?: string;
  nextEligibleDate?: string;
};

export type DonorSearchResponse = {
  items: DonorSearchResult[];
  count: number;
  radiusKm: number;
};
