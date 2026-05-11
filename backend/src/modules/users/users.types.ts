export type CreatePhoneUserInput = {
  phone: string;
};

export type CreateGoogleUserInput = {
  googleId: string;
  email?: string;
  name?: string;
  profileImage?: string;
};
