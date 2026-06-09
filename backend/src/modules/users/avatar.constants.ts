export const APP_AVATAR_PATHS = {
  male: '/images/avatar/male.svg',
  female: '/images/avatar/female.svg',
  other: '/images/avatar/other.svg',
} as const;

export type AvatarGender = 'male' | 'female' | 'other';

export function getDefaultAvatar(gender?: AvatarGender | null): string {
  if (gender === 'male') {
    return APP_AVATAR_PATHS.male;
  }

  if (gender === 'female') {
    return APP_AVATAR_PATHS.female;
  }

  return APP_AVATAR_PATHS.other;
}
