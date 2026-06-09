export type AvatarGender = "male" | "female" | "other";

export const DEFAULT_AVATAR_SRC = "/images/avatar/other.svg";

export const GENDER_AVATAR_SRC_MAP: Record<AvatarGender, string> = {
  male: "/images/avatar/male.svg",
  female: "/images/avatar/female.svg",
  other: DEFAULT_AVATAR_SRC,
};
