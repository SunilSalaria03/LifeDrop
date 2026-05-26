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
  page?: number;
  limit?: number;
};

export type DonorProfilePayload = {
  name: string;
  email?: string;
  bloodGroup: string;
  gender: string;
  birthDate: string;
  weight: number;
  phone: string;
  alternatePhone?: string;
  state: string;
  city: string;
  district: string;
  tehsil?: string;
  addressLine?: string;
  addressText?: string;
  showMobile: boolean;
  smsAlert: boolean;
  pincode?: string;
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
  gender?: string;
  birthDate?: string;
  weight?: number;
  state: string;
  city: string;
  district?: string;
  tehsil?: string;
  pincode?: string;
  showMobile?: boolean;
  smsAlert?: boolean;
  distanceKm?: number;
  isAvailable: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  totalDonations?: number;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  addressLine?: string;
  addressText?: string;
};

export type DonorDetail = DonorListItem;

export type MyDonorProfile = DonorListItem & {
  phone?: string;
  alternatePhone?: string;
  addressLine?: string;
  addressText?: string;
};

export type DonorSearchResponse = {
  items: DonorListItem[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  radiusKm: number;
};

export type DonorSmsAlertPayload = {
  donorId: string;
  bloodGroup: string;
  sendSms: boolean;
  sendWhatsapp?: boolean;
  consentToShareContact: boolean;
  message?: string;
};

export type DonorSmsAlertResponse = {
  bloodRequestId: string;
  smsStatus: 'pending' | 'sent' | 'failed';
  status: 'pending' | 'sent' | 'failed' | 'accepted' | 'rejected' | 'expired';
  smsProvider?: string;
  smsProviderMessageId?: string;
  smsError?: string;
  whatsappStatus: 'pending' | 'sent' | 'failed' | 'skipped';
  whatsappProvider?: 'twilio';
  whatsappProviderMessageId?: string;
  whatsappError?: string;
};
