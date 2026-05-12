export const testUser = {
  authProvider: 'phone',
  email: 'playwright.user@example.com',
  id: 'e2e-user-1',
  isBlocked: false,
  isProfileCompleted: true,
  name: 'Playwright User',
  phone: '+919876543210',
  phoneVerified: true,
  role: 'user',
  city: 'Chandigarh',
  district: 'Chandigarh',
  location: {
    coordinates: [76.7794, 30.7333],
    type: 'Point',
  },
  state: 'Chandigarh',
} as const;

export const incompleteUser = {
  ...testUser,
  city: undefined,
  district: undefined,
  isProfileCompleted: false,
  name: 'Incomplete User',
  state: undefined,
} as const;

export const unverifiedUser = {
  ...testUser,
  authProvider: 'google',
  name: 'Unverified User',
  phone: '',
  phoneVerified: false,
} as const;

export const donorUser = {
  ...testUser,
  bloodGroup: 'A+',
  donorProfile: {
    bloodGroup: 'A+',
    city: 'Chandigarh',
    district: 'Chandigarh',
    id: 'e2e-donor-profile-1',
    isAvailable: true,
    name: 'Playwright User',
    phone: '+919876543210',
    showMobile: false,
    state: 'Chandigarh',
    userId: testUser.id,
  },
  gender: 'male',
  role: 'donor',
  weight: 70,
} as const;

export const testCredentials = {
  otp: process.env.E2E_TEST_OTP ?? '123456',
  phone: process.env.E2E_TEST_PHONE ?? '9876543210',
} as const;

export const donorSearch = {
  bloodGroup: 'A+',
  city: 'Chandigarh',
  state: 'Chandigarh',
} as const;

export const donorFormData = {
  birthDate: '1995-05-12',
  bloodGroup: 'A+',
  district: 'Chandigarh',
  gender: 'Male',
  name: 'Playwright Donor',
  pincode: '160017',
  smsAlert: 'SMS alerts on',
  state: 'Chandigarh',
  weight: '70',
} as const;

export const profileUpdateData = {
  district: 'Chandigarh',
  email: 'updated.playwright@example.com',
  name: 'Updated Playwright User',
  pincode: '160017',
  state: 'Chandigarh',
} as const;

export const searchDonorResult = {
  bloodGroup: 'A+',
  city: 'Chandigarh',
  distanceKm: 2.4,
  district: 'Chandigarh',
  id: 'e2e-donor-1',
  isAvailable: true,
  isVerified: true,
  name: 'Asha Donor',
  phone: '+919999999999',
  showMobile: false,
  state: 'Chandigarh',
  totalDonations: 3,
  userId: 'e2e-donor-user-1',
} as const;

export const requestBloodData = {
  message: 'Need blood urgently near the hospital.',
} as const;
