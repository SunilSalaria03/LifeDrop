export type CreatePhoneUserInput = {
  phone: string;
  gender?: 'male' | 'female' | 'other';
};

export type CreateGoogleUserInput = {
  googleId: string;
  email?: string;
  name?: string;
  gender?: 'male' | 'female' | 'other';
};
